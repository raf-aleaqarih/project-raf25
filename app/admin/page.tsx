"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  BarChart3, 
  Settings, 
  Activity,
  TrendingUp,
  Eye,
  MessageCircle,
  Building2,
  ArrowUpRight,
  Calendar,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
export const dynamic = 'force-dynamic'

interface DashboardStats {
  totalUsers: number
  totalViews: number
  totalInquiries: number
  activeProjects: number
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
}

export default function AdminPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalViews: 0,
    totalInquiries: 0,
    activeProjects: 1,
    recentActivity: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Simulate API call - replace with actual API endpoints
      setStats({
        totalUsers: 25,
        totalViews: 1250,
        totalInquiries: 45,
        activeProjects: 1,
        recentActivity: [
          {
            id: '1',
            type: 'user',
            message: 'مستخدم جديد سجل في النظام',
            timestamp: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            type: 'inquiry',
            message: 'استفسار جديد من العميل أحمد محمد',
            timestamp: '2024-01-15T09:15:00Z'
          },
          {
            id: '3',
            type: 'content',
            message: 'تم تحديث معلومات المشروع',
            timestamp: '2024-01-15T08:45:00Z'
          }
        ]
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'إدارة المحتوى',
      description: 'تحديث معلومات المشروع والشقق',
      href: '/admin/control-panel',
      icon: Settings,
      color: 'bg-blue-500'
    },
    {
      title: 'إدارة المستخدمين',
      description: 'عرض وإدارة المستخدمين',
      href: '/admin/users',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'تتبع الزيارات',
      description: 'مراقبة إحصائيات الموقع',
      href: '/admin/tracking',
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'التقارير',
      description: 'عرض التقارير والإحصائيات',
      href: '/admin/reports',
      icon: Activity,
      color: 'bg-orange-500'
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          مرحباً بك، {user?.name}
        </h1>
        <p className="text-blue-100">
          لوحة التحكم الرئيسية - مشروع راف 25
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            آخر تسجيل دخول: {user?.lastLogin ? formatDate(user.lastLogin) : 'غير متوفر'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 ml-1" />
              +12% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مشاهدات الموقع</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 ml-1" />
              +8% من الأسبوع الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الاستفسارات</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 ml-1" />
              +5 استفسارات جديدة اليوم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع النشطة</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              مشروع راف 25 - جدة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            النشاط الأخير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 space-x-reverse">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.type === 'user' && 'مستخدم'}
                  {activity.type === 'inquiry' && 'استفسار'}
                  {activity.type === 'content' && 'محتوى'}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              عرض جميع الأنشطة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
