import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { jwtService } from '@/lib/jwt-service'
export const runtime = 'nodejs'

// GET /api/admin/dashboard - Get dashboard statistics
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

    // Get user statistics
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    const inactiveUsers = await User.countDocuments({ isActive: false })
    const adminUsers = await User.countDocuments({ role: 'admin' })
    const regularUsers = await User.countDocuments({ role: 'user' })

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })

    // Get users with recent login (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentlyActiveUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    })

    // Get recent activity (last 10 users)
    const recentActivity = await User.find()
      .select('name email createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Format recent activity for frontend
    const formattedActivity = recentActivity.map(user => ({
      id: user._id.toString(),
      type: 'user',
      message: `مستخدم جديد: ${user.name}`,
      timestamp: user.createdAt,
      details: {
        email: user.email,
        lastLogin: user.lastLogin
      }
    }))

    // Calculate growth percentages (mock data for now)
    const userGrowthPercentage = recentUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0
    const activeUserPercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0

    // Get user registration trend (last 30 days)
    const registrationTrend = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const startOfDay = new Date(date.setHours(0, 0, 0, 0))
      const endOfDay = new Date(date.setHours(23, 59, 59, 999))
      
      const count = await User.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      })
      
      registrationTrend.push({
        date: startOfDay.toISOString().split('T')[0],
        count
      })
    }

    const dashboardStats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        admins: adminUsers,
        regular: regularUsers,
        recentlyRegistered: recentUsers,
        recentlyActive: recentlyActiveUsers,
        growthPercentage: userGrowthPercentage,
        activePercentage: activeUserPercentage
      },
      activity: {
        recent: formattedActivity,
        registrationTrend
      },
      // Mock data for other metrics
      website: {
        totalViews: 1250,
        uniqueVisitors: 890,
        bounceRate: 35,
        avgSessionDuration: 180, // seconds
        viewsGrowth: 8.5,
        visitorsGrowth: 12.3
      },
      inquiries: {
        total: 45,
        pending: 12,
        resolved: 33,
        todayCount: 5,
        growthPercentage: 15.2
      },
      projects: {
        active: 1,
        total: 1,
        name: 'راف 25 - جدة'
      }
    }

    return NextResponse.json({
      success: true,
      data: dashboardStats
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}