"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  Download,
  Calendar,
  Eye,
  MessageCircle,
  Clock,
  Target,
  Filter
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
export const dynamic = 'force-dynamic'

interface ReportData {
  summary?: {
    totalUsers: number
    activeUsers: number
    adminUsers: number
    inactiveUsers: number
  }
  trends?: {
    monthly: Array<{
      month: string
      count: number
      date: string
    }>
  }
  website?: {
    totalPageViews: number
    uniqueVisitors: number
    averageSessionDuration: number
    bounceRate: number
    topPages: Array<{
      page: string
      views: number
      percentage: number
    }>
  }
  inquiries?: {
    total: number
    resolved: number
    pending: number
    averageResponseTime: number
    satisfactionRate: number
  }
  users?: Array<{
    id: string
    name: string
    email: string
    role: string
    isActive: boolean
    createdAt: string
    lastLogin?: string
  }>
  analytics?: {
    total: number
    roleDistribution: Array<{
      role: string
      count: number
      percentage: number
    }>
    activeInLast30Days: number
    registrationByDay: Array<{
      day: string
      count: number
    }>
  }
  timeline?: Array<{
    id: string
    type: string
    message: string
    timestamp: string
    details: any
  }>
  loginFrequency?: Array<{
    date: string
    logins: number
  }>
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [reportData, setReportData] = useState<ReportData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [reportType, setReportType] = useState('overview')
  const [dateRange, setDateRange] = useState('30')

  useEffect(() => {
    fetchReportData()
  }, [reportType, dateRange])

  const fetchReportData = async () => {
    setIsLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(dateRange))

      const response = await fetch(
        `/api/admin/reports?type=${reportType}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          credentials: 'include'
        }
      )
      
      if (response.ok) {
        const result = await response.json()
        setReportData(result.data || {})
      } else {
        toast.error('فشل في تحميل بيانات التقارير')
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
      toast.error('حدث خطأ في تحميل البيانات')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const exportReport = () => {
    // Mock export functionality
    toast.success('سيتم تصدير التقرير قريباً')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-600">تحليل شامل لأداء النظام والمستخدمين</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">نظرة عامة</SelectItem>
              <SelectItem value="users">تقرير المستخدمين</SelectItem>
              <SelectItem value="activity">تقرير النشاط</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 أيام</SelectItem>
              <SelectItem value="30">30 يوم</SelectItem>
              <SelectItem value="90">90 يوم</SelectItem>
              <SelectItem value="365">سنة</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary?.totalUsers || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-green-600" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">مشاهدات الصفحات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.website?.totalPageViews?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">الاستفسارات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.inquiries?.total || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-orange-600" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">معدل الرضا</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.inquiries?.satisfactionRate || 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Website Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  إحصائيات الموقع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">الزوار الفريدون</span>
                    <span className="font-semibold">
                      {reportData.website?.uniqueVisitors?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">متوسط مدة الجلسة</span>
                    <span className="font-semibold">
                      {formatDuration(reportData.website?.averageSessionDuration || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">معدل الارتداد</span>
                    <span className="font-semibold">
                      {reportData.website?.bounceRate || 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أهم الصفحات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.website?.topPages?.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{page.page}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {page.views.toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {page.percentage}%
                        </Badge>
                      </div>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                اتجاه التسجيل الشهري
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.trends?.monthly?.slice(-6).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min((item.count / Math.max(...(reportData.trends?.monthly?.map(m => m.count) || [1]))) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8 text-left">
                        {item.count}
                      </span>
                    </div>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Users Report */}
      {reportType === 'users' && (
        <>
          {/* User Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الأدوار</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.analytics?.roleDistribution?.map((role, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{role.role}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{role.count}</span>
                        <Badge variant="secondary" className="text-xs">
                          {role.percentage}%
                        </Badge>
                      </div>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>النشاط الأخير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {reportData.analytics?.activeInLast30Days || 0}
                  </div>
                  <p className="text-sm text-gray-600">نشط في آخر 30 يوم</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>التسجيل حسب اليوم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportData.analytics?.registrationByDay?.map((day, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{day.day}</span>
                      <span className="font-semibold">{day.count}</span>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                    <TableHead>آخر دخول</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.users?.slice(0, 10).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        {user.lastLogin ? formatDate(user.lastLogin) : 'لم يسجل دخول'}
                      </TableCell>
                    </TableRow>
                  )) || []}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Activity Report */}
      {reportType === 'activity' && (
        <>
          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                سجل النشاط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.timeline?.slice(0, 20).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 space-x-reverse">
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
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>

          {/* Login Frequency */}
          <Card>
            <CardHeader>
              <CardTitle>تكرار تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.loginFrequency?.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{formatDate(item.date)}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min((item.logins / Math.max(...(reportData.loginFrequency?.map(l => l.logins) || [1]))) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-6 text-left">
                        {item.logins}
                      </span>
                    </div>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}