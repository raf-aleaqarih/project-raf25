import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { jwtService } from '@/lib/jwt-service'
export const runtime = 'nodejs'

// GET /api/admin/reports - Get detailed reports and analytics
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Verify admin access
    const token = request.cookies.get('accessToken')?.value
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح بالوصول'
      }, { status: 401 })
    }

    const payload = jwtService.verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'غير مصرح بالوصول'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'overview'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let dateFilter = {}
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    }

    switch (reportType) {
      case 'users':
        return await getUsersReport(dateFilter)
      
      case 'activity':
        return await getActivityReport(dateFilter)
      
      case 'overview':
      default:
        return await getOverviewReport(dateFilter)
    }

  } catch (error) {
    console.error('Reports error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}

async function getOverviewReport(dateFilter: any) {
  // User statistics
  const totalUsers = await User.countDocuments(dateFilter)
  const activeUsers = await User.countDocuments({ ...dateFilter, isActive: true })
  const adminUsers = await User.countDocuments({ ...dateFilter, role: 'admin' })

  // Monthly user registration trend
  const monthlyTrend = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    const count = await User.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    })
    
    monthlyTrend.push({
      month: startOfMonth.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }),
      count,
      date: startOfMonth.toISOString()
    })
  }

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalUsers,
        activeUsers,
        adminUsers,
        inactiveUsers: totalUsers - activeUsers
      },
      trends: {
        monthly: monthlyTrend
      },
      // Mock data for other metrics
      website: {
        totalPageViews: 15420,
        uniqueVisitors: 8930,
        averageSessionDuration: 245,
        bounceRate: 32.5,
        topPages: [
          { page: '/', views: 5420, percentage: 35.2 },
          { page: '/apartments', views: 3210, percentage: 20.8 },
          { page: '/contact', views: 2890, percentage: 18.7 },
          { page: '/about', views: 1950, percentage: 12.6 },
          { page: '/gallery', views: 1950, percentage: 12.7 }
        ]
      },
      inquiries: {
        total: 156,
        resolved: 134,
        pending: 22,
        averageResponseTime: 4.2, // hours
        satisfactionRate: 94.5
      }
    }
  })
}

async function getUsersReport(dateFilter: any) {
  // Detailed user analytics
  const users = await User.find(dateFilter)
    .select('name email role isActive createdAt lastLogin')
    .sort({ createdAt: -1 })
    .lean()

  // User role distribution
  const roleDistribution = await User.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ])

  // User activity analysis
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const activeInLast30Days = await User.countDocuments({
    ...dateFilter,
    lastLogin: { $gte: thirtyDaysAgo }
  })

  // Registration by day of week
  const registrationByDay = await User.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ])

  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
  const formattedRegistrationByDay = registrationByDay.map(item => ({
    day: dayNames[item._id - 1],
    count: item.count
  }))

  return NextResponse.json({
    success: true,
    data: {
      users: users.map(user => ({
        ...user,
        id: user._id.toString(),
        _id: undefined
      })),
      analytics: {
        total: users.length,
        roleDistribution: roleDistribution.map(item => ({
          role: item._id === 'admin' ? 'مدير' : 'مستخدم',
          count: item.count,
          percentage: Math.round((item.count / users.length) * 100)
        })),
        activeInLast30Days,
        registrationByDay: formattedRegistrationByDay
      }
    }
  })
}

async function getActivityReport(dateFilter: any) {
  // Recent user activities
  const recentUsers = await User.find(dateFilter)
    .select('name email createdAt lastLogin')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

  // Login frequency analysis
  const loginFrequency = await User.aggregate([
    { $match: { lastLogin: { $exists: true } } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$lastLogin'
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': -1 } },
    { $limit: 30 }
  ])

  // Activity timeline
  const activityTimeline = recentUsers.map(user => ({
    id: user._id.toString(),
    type: 'registration',
    message: `تسجيل مستخدم جديد: ${user.name}`,
    timestamp: user.createdAt,
    details: {
      email: user.email,
      lastLogin: user.lastLogin
    }
  }))

  return NextResponse.json({
    success: true,
    data: {
      timeline: activityTimeline,
      loginFrequency: loginFrequency.map(item => ({
        date: item._id,
        logins: item.count
      })),
      summary: {
        totalActivities: activityTimeline.length,
        averageLoginsPerDay: loginFrequency.length > 0 
          ? Math.round(loginFrequency.reduce((sum, item) => sum + item.count, 0) / loginFrequency.length)
          : 0
      }
    }
  })
}