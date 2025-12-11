"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Building2,
  Home,
  MapPin,
  Phone,
  Share2,
  Target,
  Shield,
  Star,
  MessageCircle,
  Image,
  FileText,
  Database,
  Lock,
  Activity,
  X
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

interface NavItem {
  title: string
  href: string
  icon: any
  badge?: string
  requiredRole?: string[]
  children?: NavItem[]
}

export function AdminSidebar({ isOpen, onClose, user }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigationItems: NavItem[] = [
    {
      title: "لوحة التحكم الرئيسية",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "إدارة المحتوى",
      href: "/admin/control-panel",
      icon: Settings,
      children: [
        {
          title: "معلومات المشروع",
          href: "/admin/control-panel?tab=project",
          icon: Building2
        },
        {
          title: "الشقق والأسعار",
          href: "/admin/control-panel?tab=apartments",
          icon: Home
        },
        {
          title: "الصفحة الرئيسية",
          href: "/admin/control-panel?tab=hero",
          icon: Target
        },
        {
          title: "المميزات الإستراتيجية",
          href: "/admin/control-panel?tab=strategic",
          icon: Shield
        },
        {
          title: "مميزات المشروع",
          href: "/admin/control-panel?tab=highlights",
          icon: Star
        }
      ]
    },
    {
      title: "إدارة المستخدمين",
      href: "/admin/users",
      icon: Users,
      requiredRole: ['admin'],
      badge: "مدير"
    },
    {
      title: "تتبع الزيارات",
      href: "/admin/tracking",
      icon: BarChart3,
    },
    {
      title: "إدارة الصور",
      href: "/admin/media",
      icon: Image,
    },
    {
      title: "التقارير والإحصائيات",
      href: "/admin/reports",
      icon: Activity,
    },
    {
      title: "إعدادات الموقع",
      href: "/admin/settings",
      icon: Lock,
      requiredRole: ['admin'],
      children: [
        {
          title: "الإعدادات العامة",
          href: "/admin/settings/general",
          icon: Settings
        },
        {
          title: "إعدادات الأمان",
          href: "/admin/settings/security",
          icon: Shield
        },
        {
          title: "إعدادات البريد الإلكتروني",
          href: "/admin/settings/email",
          icon: MessageCircle
        }
      ]
    }
  ]

  const hasPermission = (requiredRole?: string[]) => {
    if (!requiredRole) return true
    return requiredRole.includes(user?.role)
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    if (!hasPermission(item.requiredRole)) {
      return null
    }

    const Icon = item.icon
    const active = isActive(item.href)

    return (
      <div>
        <Link
          href={item.href}
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            level > 0 && "mr-6",
            active
              ? "bg-blue-100 text-blue-900"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
        
        {item.children && (
          <div className="mt-1 space-y-1">
            {item.children.map((child) => (
              <NavLink key={child.href} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900">لوحة الإدارة</h1>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 mb-2">
                  التنقل الرئيسي
                </div>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <NavLink item={item} />
                    </li>
                  ))}
                </ul>
              </li>
              
              <li className="mt-auto">
                <Separator className="mb-4" />
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-sm font-medium text-blue-900">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.role === 'admin' ? 'مدير النظام' : 'مستخدم'}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-900">لوحة الإدارة</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="flex-1 px-6 pb-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <span className="text-sm font-medium text-blue-900">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === 'admin' ? 'مدير النظام' : 'مستخدم'}
              </p>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}