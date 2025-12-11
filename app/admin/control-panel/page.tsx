"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  Home, 
  MapPin, 
  Phone, 
  Share2, 
  Settings, 
  Save,
  Plus,
  Trash2,
  Edit,
  Target,
  Star,
  Shield,
  Zap,
  MessageCircle,
  Loader2,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  AlertCircle,
  CheckCircle,
  Info,
  Wifi,
  Camera,
  Users,
  LucideSnowflake,
  Droplets,
  Users2,

} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { UserProfile } from "@/components/user-profile"
import { UserManagement } from "@/components/user-management"

import apiService from "@/lib/api-service"
import { WebsiteData } from "@/lib/website-data"
import { validateWebsiteData, validateSection, ValidationError } from "@/lib/data-validation"
import { toast } from 'react-toastify'
export const dynamic = 'force-dynamic'

// Icon mapping
const iconMap: { [key: string]: any } = {
  Shield,
  Wifi,
  Camera,
  Users,
  MapPin,
  CheckCircle,
  LucideSnowflake,
  Building2,
  Zap,
  Droplets,
  Users2
}

// Navigation items configuration
const navigationItems = [
  {
    id: "project",
    label: "معلومات المشروع",
    icon: Building2,
    description: "البيانات الأساسية للمشروع"
  },
  {
    id: "apartments",
    label: "الشقق والأسعار",
    icon: Home,
    description: "إدارة نماذج الشقق والأسعار"
  },
  {
    id: "location",
    label: "الموقع والعنوان",
    icon: MapPin,
    description: "معلومات الموقع والمميزات"
  },
  // {
  //   id: "contact",
  //   label: "معلومات التواصل",
  //   icon: Phone,
  //   description: "أرقام الهاتف والبريد الإلكتروني"
  // },
  {
    id: "social",
    label: "وسائل التواصل الاجتماعي",
    icon: Share2,
    description: "روابط المنصات الاجتماعية"
  },
  {
    id: "hero",
    label: "الصفحة الرئيسية",
    icon: Target,
    description: "محتوى القسم الرئيسي"
  },
  {
    id: "strategic",
    label: "المميزات الإستراتيجية",
    icon: Shield,
    description: "المميزات والتفاصيل الإستراتيجية"
  },
  {
    id: "highlights",
    label: "مميزات المشروع",
    icon: Star,
    description: "مميزات وضمانات المشروع"
  },
  {
    id: "gallery",
    label: "معرض الصور",
    icon: Settings,
    description: "إدارة معرض الصور"
  },
  // {
  //   id: "contact-section",
  //   label: "قسم التواصل",
  //   icon: MessageCircle,
  //   description: "إعدادات نموذج التواصل"
  // },
  {
    id: "trust",
    label: "الضمانات",
    icon: Zap,
    description: "عوامل الثقة والضمانات"
  },
  {
    id: "profile",
    label: "الملف الشخصي",
    icon: Users,
    description: "إدارة الملف الشخصي وكلمة السر"
  },
  {
    id: "users",
    label: "إدارة المستخدمين",
    icon: Users2,
    description: "إضافة وتعديل وحذف المستخدمين"
  },
  // {
  //   id: "whatsapp-cta",
  //   label: "واتساب CTA",
  //   icon: Phone,
  //   description: "زر الواتساب الرئيسي"
  // },
  // {
  //   id: "whatsapp-section",
  //   label: "قسم الواتساب",
  //   icon: MessageCircle,
  //   description: "قسم الواتساب التفاعلي"
  // }
]

export default function ControlPanel() {
  const [data, setData] = useState<WebsiteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("project")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  // Load data from API on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const websiteData = await apiService.getAllData()
      setData(websiteData)
    } catch (error) {
      setError(apiService.handleError(error))
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSection = async (sectionName: string, sectionData: any) => {
    try {
      setIsSaving(true)
      setError(null)
      
      // Create endpoint URL based on section name
      let endpoint = ''
      switch(sectionName) {
        case 'hero':
          endpoint = '/api/website-data/hero'
          break
        case 'apartments':
          endpoint = '/api/website-data/apartments'
          break
        case 'project-highlights':
          endpoint = '/api/website-data/project-highlights'
          break
        case 'strategic-features':
          endpoint = '/api/website-data/strategic-features'
          break
        case 'trust-factors':
          endpoint = '/api/website-data/trust-factors'
          break
        case 'trust-indicators':
          endpoint = '/api/website-data/trust-indicators'
          break
        case 'image-carousel':
          endpoint = '/api/website-data/image-carousel'
          break
        case 'contact-section':
          endpoint = '/api/website-data/contact-section'
          break
        case 'whatsapp-cta':
          endpoint = '/api/website-data/whatsapp-cta'
          break
        case 'whatsapp-section':
          endpoint = '/api/website-data/whatsapp-section'
          break
        case 'location-advantages':
          endpoint = '/api/website-data/location-advantages'
          break
        case 'social-media':
          endpoint = '/api/website-data/social-media'
          break
        default:
          // For general sections like project, contact, social, location
          if (!data) return
          await apiService.updateAllData(data)
          toast.success(`تم حفظ بيانات ${sectionName} بنجاح!`)
          return
      }

      // Send POST request to specific endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: sectionData }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast.success(`تم حفظ بيانات ${sectionName} بنجاح!`)
    } catch (error) {
      const errorMessage = apiService.handleError(error)
      setError(errorMessage)
      toast.error(`خطأ في حفظ ${sectionName}: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleProjectUpdate = (field: string, value: string) => {
    if (!data) return
    setData(prev => {
      if (!prev) return null
      return {
        ...prev,
        project: { ...prev.project, [field]: value }
      }
    })
  }

  const handleContactUpdate = (field: string, value: string) => {
    if (!data) return
    setData(prev => {
      if (!prev) return null
      return {
        ...prev,
        contact: { ...prev.contact, [field]: value }
      }
    })
  }

  const handleSocialMediaUpdate = (index: number, field: string, value: string) => {
    if (!data) return
    setData(prev => {
      if (!prev) return null
      return {
        ...prev,
        socialMedia: prev.socialMedia.map((sm, i) => 
          i === index ? { ...sm, [field]: value } : sm
        )
      }
    })
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#540f6b]" />
          <h2 className="text-xl font-semibold text-gray-700">جاري تحميل البيانات...</h2>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">خطأ في تحميل البيانات</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData} className="bg-[#540f6b] hover:bg-[#4a0d5f]">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    )
  }

  // Show main content
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">لا توجد بيانات متاحة</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-white shadow-lg border-l border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-full`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-[#540f6b]" />
              <h2 className="text-lg font-semibold text-gray-900">لوحة التحكم</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-[#540f6b] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#540f6b] hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className={`text-xs ${activeTab === item.id ? 'text-gray-200' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                  {activeTab === item.id && sidebarOpen && (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeTab)?.label}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {navigationItems.find(item => item.id === activeTab)?.description}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* Project Information Tab */}
            {activeTab === "project" && (
              <Card>
                <CardHeader>
                  <CardTitle>معلومات المشروع الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="projectName">اسم المشروع</Label>
                      <Input
                        id="projectName"
                        value={data.project.name}
                        onChange={(e) => handleProjectUpdate("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">رقم الترخيص</Label>
                      <Input
                        id="licenseNumber"
                        value={data.project.licenseNumber}
                        onChange={(e) => handleProjectUpdate("licenseNumber", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('project', data.project)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ معلومات المشروع
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hero Section Tab */}
            {activeTab === "hero" && (
              <Card>
                <CardHeader>
                  <CardTitle>إدارة القسم الرئيسي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="heroTitle">العنوان الرئيسي</Label>
                      <Input
                        id="heroTitle"
                        value={data.hero.title}
                        onChange={(e) => setData(prev => prev ? { ...prev, hero: { ...prev.hero, title: e.target.value } } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroSubtitle">العنوان الفرعي</Label>
                      <Input
                        id="heroSubtitle"
                        value={data.hero.subtitle}
                        onChange={(e) => setData(prev => prev ? { ...prev, hero: { ...prev.hero, subtitle: e.target.value } } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroLocation">الموقع</Label>
                      <Input
                        id="heroLocation"
                        value={data.hero.location}
                        onChange={(e) => setData(prev => prev ? { ...prev, hero: { ...prev.hero, location: e.target.value } } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroStartingPrice">السعر الأساسي</Label>
                      <Input
                        id="heroStartingPrice"
                        value={data.hero.startingPrice}
                        onChange={(e) => setData(prev => prev ? { ...prev, hero: { ...prev.hero, startingPrice: e.target.value } } : null)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ImageUpload
                        label="صورة الخلفية"
                        value={data.hero.backgroundImage}
                        onChange={(url) => setData(prev => prev ? { ...prev, hero: { ...prev.hero, backgroundImage: url } } : null)}
                        aspectRatio="aspect-[16/9]"
                        placeholder="اسحب وأفلت صورة الخلفية هنا أو انقر للاختيار"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('hero', data.hero)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ بيانات القسم الرئيسي
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information Tab */}
            {activeTab === "contact" && (
              <Card>
                <CardHeader>
                  <CardTitle>معلومات التواصل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">رقم الهاتف</Label>
                      <Input
                        id="contactPhone"
                        value={data.contact.phone}
                        onChange={(e) => handleContactUpdate("phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactWhatsapp">رقم الواتساب</Label>
                      <Input
                        id="contactWhatsapp"
                        value={data.contact.whatsapp}
                        onChange={(e) => handleContactUpdate("whatsapp", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={data.contact.email}
                        onChange={(e) => handleContactUpdate("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('contact', data.contact)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ معلومات التواصل
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
              <Card>
                <CardHeader>
                  <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.socialMedia.map((social, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                             <div className="grid md:grid-cols-2 gap-4">
                         <div>
                           <Label htmlFor={`social-platform-${index}`}>المنصة</Label>
                           <Input
                             id={`social-platform-${index}`}
                             value={social.platform}
                             onChange={(e) => handleSocialMediaUpdate(index, "platform", e.target.value)}
                           />
                         </div>
                         <div>
                           <Label htmlFor={`social-url-${index}`}>الرابط</Label>
                           <Input
                             id={`social-url-${index}`}
                             value={social.url}
                             onChange={(e) => handleSocialMediaUpdate(index, "url", e.target.value)}
                           />
                         </div>
                       </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('social-media', data.socialMedia)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ وسائل التواصل
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Apartments Management Tab */}
            {activeTab === "apartments" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    إدارة الشقق والأسعار
                    <Button 
                      onClick={() => {
                        if (!data) return
                        const newApartment = {
                          id: `apt-${Date.now()}`,
                          name: "شقة جديدة",
                          price: "0",
                          area: "0",
                          rooms: 1,
                          bathrooms: 1,
                          features: [],
                          popular: false,
                          image: "/default.jpg"
                        }
                        setData(prev => prev ? { ...prev, apartments: [...prev.apartments, newApartment] } : null)
                      }}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f]"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة شقة جديدة
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {data.apartments.map((apartment, index) => (
                    <div key={apartment.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">شقة #{index + 1}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                apartments: prev.apartments.map(apt => 
                                  apt.id === apartment.id ? { ...apt, popular: !apt.popular } : apt
                                )
                              } : null)
                            }}
                            className={apartment.popular ? "bg-green-100 text-green-700" : ""}
                          >
                            <Star className={`w-4 h-4 ml-1 ${apartment.popular ? 'fill-current' : ''}`} />
                            {apartment.popular ? 'مميزة' : 'عادية'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                apartments: prev.apartments.filter(apt => apt.id !== apartment.id)
                              } : null)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`apt-name-${index}`}>اسم الشقة</Label>
                          <Input
                            id={`apt-name-${index}`}
                            value={apartment.name}
                            onChange={(e) => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                apartments: prev.apartments.map(apt => 
                                  apt.id === apartment.id ? { ...apt, name: e.target.value } : apt
                                )
                              } : null)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`apt-price-${index}`}>السعر (ريال)</Label>
                          <Input
                            id={`apt-price-${index}`}
                            value={apartment.price}
                            onChange={(e) => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                apartments: prev.apartments.map(apt => 
                                  apt.id === apartment.id ? { ...apt, price: e.target.value } : apt
                                )
                              } : null)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`apt-area-${index}`}>المساحة (متر مربع)</Label>
                          <Input
                            id={`apt-area-${index}`}
                            value={apartment.area}
                            onChange={(e) => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                apartments: prev.apartments.map(apt => 
                                  apt.id === apartment.id ? { ...apt, area: e.target.value } : apt
                                )
                              } : null)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`apt-rooms-${index}`}>عدد الغرف</Label>
                          <Input
                            id={`apt-rooms-${index}`}
                            type="number"
                            value={apartment.rooms}
                            onChange={(e) => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                apartments: prev.apartments.map(apt => 
                                  apt.id === apartment.id ? { ...apt, rooms: parseInt(e.target.value) || 0 } : apt
                                )
                              } : null)
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`apt-bathrooms-${index}`}>عدد دورات المياه</Label>
                          <Input
                            id={`apt-bathrooms-${index}`}
                            type="number"
                            value={apartment.bathrooms}
                            onChange={(e) => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                apartments: prev.apartments.map(apt => 
                                  apt.id === apartment.id ? { ...apt, bathrooms: parseInt(e.target.value) || 0 } : apt
                                )
                              } : null)
                            }}
                          />
                        </div>
                        <div>
                          <ImageUpload
                            label="صورة الشقة"
                            value={apartment.image}
                            onChange={(url) => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                apartments: prev.apartments.map(apt => 
                                  apt.id === apartment.id ? { ...apt, image: url } : apt
                                )
                              } : null)
                            }}
                            aspectRatio="aspect-[4/3]"
                            placeholder="اسحب وأفلت صورة الشقة هنا أو انقر للاختيار"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`apt-features-${index}`}>المميزات (منفصلة بفاصلة)</Label>
                        <Textarea
                          id={`apt-features-${index}`}
                          value={apartment.features.join(', ')}
                          onChange={(e) => {
                            if (!data) return
                            const features = e.target.value.split(',').map(f => f.trim()).filter(f => f)
                            setData(prev => prev ? {
                              ...prev,
                              apartments: prev.apartments.map(apt => 
                                apt.id === apartment.id ? { ...apt, features } : apt
                              )
                            } : null)
                          }}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('apartments', data.apartments)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ بيانات الشقق
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Management Tab */}
            {activeTab === "location" && (
              <Card>
                <CardHeader>
                  <CardTitle>إدارة الموقع والعنوان</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="locationAddress">العنوان</Label>
                    <Input
                      id="locationAddress"
                      value={data.location.address}
                      onChange={(e) => setData(prev => prev ? { 
                        ...prev, 
                        location: { ...prev.location, address: e.target.value } 
                      } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationMapUrl">رابط الخريطة</Label>
                    <Textarea
                      id="locationMapUrl"
                      value={data.location.mapUrl}
                      onChange={(e) => setData(prev => prev ? { 
                        ...prev, 
                        location: { ...prev.location, mapUrl: e.target.value } 
                      } : null)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>مميزات الموقع</Label>
                    <div className="space-y-4 mt-2">
                      {data.location.features.map((feature, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">ميزة #{index + 1}</h4>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setData(prev => prev ? {
                                  ...prev,
                                  location: {
                                    ...prev.location,
                                    features: prev.location.features.filter((_, i) => i !== index)
                                  }
                                } : null)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                                                     <div className="grid md:grid-cols-2 gap-4">
                             <div>
                               <Label htmlFor={`feature-title-${index}`}>العنوان</Label>
                               <Input
                                 id={`feature-title-${index}`}
                                 value={feature.title}
                                 onChange={(e) => {
                                   setData(prev => prev ? {
                                     ...prev,
                                     location: {
                                       ...prev.location,
                                       features: prev.location.features.map((f, i) => 
                                         i === index ? { ...f, title: e.target.value } : f
                                       )
                                     }
                                   } : null)
                                 }}
                               />
                             </div>
                             <div>
                               <Label htmlFor={`feature-time-${index}`}>الوقت/المسافة</Label>
                               <Input
                                 id={`feature-time-${index}`}
                                 value={feature.time}
                                 onChange={(e) => {
                                   setData(prev => prev ? {
                                     ...prev,
                                     location: {
                                       ...prev.location,
                                       features: prev.location.features.map((f, i) => 
                                         i === index ? { ...f, time: e.target.value } : f
                                       )
                                     }
                                   } : null)
                                 }}
                               />
                             </div>
                           </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setData(prev => prev ? {
                            ...prev,
                            location: {
                              ...prev.location,
                              features: [...prev.location.features, {
                                title: "ميزة جديدة",
                                time: "0 دقائق",
                                icon: "MapPin"
                              }]
                            }
                          } : null)
                        }}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة ميزة جديدة
                      </Button>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('location-advantages', data.location)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ بيانات الموقع
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Strategic Features Tab */}
            {activeTab === "strategic" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    إدارة المميزات الإستراتيجية
                    <Button 
                      onClick={() => {
                        if (!data) return
                        const newFeature = {
                          icon: "Star",
                          title: "ميزة جديدة",
                          description: "",
                          details: [],
                          isMain: false
                        }
                        setData(prev => prev ? { ...prev, strategicFeatures: [...prev.strategicFeatures, newFeature] } : null)
                      }}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f]"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة ميزة
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {data.strategicFeatures.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">ميزة #{index + 1}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                strategicFeatures: prev.strategicFeatures.map((f, i) => 
                                  i === index ? { ...f, isMain: !f.isMain } : f
                                )
                              } : null)
                            }}
                            className={feature.isMain ? "bg-blue-100 text-blue-700" : ""}
                          >
                            <Star className={`w-4 h-4 ml-1 ${feature.isMain ? 'fill-current' : ''}`} />
                            {feature.isMain ? 'رئيسية' : 'عادية'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                strategicFeatures: prev.strategicFeatures.filter((_, i) => i !== index)
                              } : null)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                                             <div>
                         <Label htmlFor={`strategic-title-${index}`}>العنوان</Label>
                         <Input
                           id={`strategic-title-${index}`}
                           value={feature.title}
                           onChange={(e) => {
                             if (!data) return
                             setData(prev => prev ? {
                               ...prev,
                               strategicFeatures: prev.strategicFeatures.map((f, i) => 
                                 i === index ? { ...f, title: e.target.value } : f
                               )
                             } : null)
                           }}
                         />
                       </div>
                      <div>
                        <Label htmlFor={`strategic-description-${index}`}>الوصف</Label>
                        <Input
                          id={`strategic-description-${index}`}
                          value={feature.description || ''}
                          onChange={(e) => {
                            if (!data) return
                            setData(prev => prev ? {
                              ...prev,
                              strategicFeatures: prev.strategicFeatures.map((f, i) => 
                                i === index ? { ...f, description: e.target.value } : f
                              )
                            } : null)
                          }}
                        />
                      </div>
                      <div>
                        <Label>الشروط الأساسية</Label>
                        <div className="space-y-2">
                          {feature.details?.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex gap-2">
                              <Input
                                value={detail}
                                onChange={(e) => {
                                  if (!data) return
                                  setData(prev => prev ? {
                                    ...prev,
                                    strategicFeatures: prev.strategicFeatures.map((f, i) => 
                                      i === index ? { 
                                        ...f, 
                                        details: f.details?.map((d, di) => 
                                          di === detailIndex ? e.target.value : d
                                        ) || []
                                      } : f
                                    )
                                  } : null)
                                }}
                                placeholder="أدخل الشرط الأساسي"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (!data) return
                                  setData(prev => prev ? {
                                    ...prev,
                                    strategicFeatures: prev.strategicFeatures.map((f, i) => 
                                      i === index ? { 
                                        ...f, 
                                        details: f.details?.filter((_, di) => di !== detailIndex) || []
                                      } : f
                                    )
                                  } : null)
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!data) return
                              setData(prev => prev ? {
                                ...prev,
                                strategicFeatures: prev.strategicFeatures.map((f, i) => 
                                  i === index ? { 
                                    ...f, 
                                    details: [...(f.details || []), ''] 
                                  } : f
                                )
                              } : null)
                            }}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 ml-2 text-black hover:text-[#540f6b]" />
                    <span className="text-black hover:text-[#540f6b]">إضافة شرط</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('strategic-features', data.strategicFeatures)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ المميزات الإستراتيجية
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Highlights Tab */}
            {activeTab === "highlights" && (
              <div className="space-y-6">
                {/* معلومات القسم */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    يمكنك إدارة مميزات المشروع التي تظهر للمستخدمين لتعريفهم بأهم مميزات المشروع
                  </AlertDescription>
                </Alert>

                {/* إدارة مميزات المشروع */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#540f6b]" />
                        إدارة مميزات المشروع
                        <Badge variant="secondary" className="mr-2">
                          {data.projectHighlights.length} ميزة
                          {data.projectHighlights.length > 0 && (
                            <span className="mr-1">
                              ({data.projectHighlights.filter(h => h.title && h.title !== "ميزة جديدة").length} مكتمل)
                            </span>
                          )}
                        </Badge>
                      </CardTitle>
                      <Button 
                        onClick={() => {
                          if (!data) return
                          const newHighlight = {
                            icon: "Star",
                            title: "ميزة جديدة"
                          }
                          setData(prev => prev ? { ...prev, projectHighlights: [...prev.projectHighlights, newHighlight] } : null)
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة ميزة جديدة
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {data.projectHighlights.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">لا توجد مميزات مضافة حالياً</p>
                        <p className="text-sm mb-4">اضغط على "إضافة ميزة جديدة" لبدء إضافة مميزات المشروع</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                          <p className="font-medium mb-2">💡 نصائح لإضافة مميزات فعالة:</p>
                          <ul className="text-right space-y-1">
                            <li>• الموقع الاستراتيجي</li>
                            <li>• التصميم المودرن</li>
                            <li>• الخدمات المتكاملة</li>
                            <li>• الأمان والحماية</li>
                            <li>• التكنولوجيا الذكية</li>
                            <li>• المرافق الترفيهية</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {data.projectHighlights.map((highlight, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#540f6b] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                <h4 className="font-semibold text-lg">ميزة #{index + 1}</h4>
                                {highlight.title && highlight.title !== "ميزة جديدة" && (
                                  <Badge variant="outline" className="text-xs">
                                    {highlight.title}
                                  </Badge>
                                )}
                                {(!highlight.title || highlight.title === "ميزة جديدة") && (
                                  <Badge variant="secondary" className="text-xs text-orange-600 bg-orange-50">
                                    يحتاج تعديل
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Move highlight up
                                    if (index > 0) {
                                      setData(prev => prev ? {
                                        ...prev,
                                        projectHighlights: prev.projectHighlights.map((h, i) => {
                                          if (i === index - 1) return prev.projectHighlights[index]
                                          if (i === index) return prev.projectHighlights[index - 1]
                                          return h
                                        })
                                      } : null)
                                    }
                                  }}
                                  disabled={index === 0}
                                  className="text-xs"
                                >
                                  ↑
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Move highlight down
                                    if (index < data.projectHighlights.length - 1) {
                                      setData(prev => prev ? {
                                        ...prev,
                                        projectHighlights: prev.projectHighlights.map((h, i) => {
                                          if (i === index) return prev.projectHighlights[index + 1]
                                          if (i === index + 1) return prev.projectHighlights[index]
                                          return h
                                        })
                                      } : null)
                                    }
                                  }}
                                  disabled={index === data.projectHighlights.length - 1}
                                  className="text-xs"
                                >
                                  ↓
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    if (showDeleteConfirm === index) {
                                      // Confirm deletion
                                      setData(prev => prev ? {
                                        ...prev,
                                        projectHighlights: prev.projectHighlights.filter((_, i) => i !== index)
                                      } : null)
                                      setShowDeleteConfirm(null)
                                    } else {
                                      // Show confirmation
                                      setShowDeleteConfirm(index)
                                      // Auto-hide after 3 seconds
                                      setTimeout(() => setShowDeleteConfirm(null), 3000)
                                    }
                                  }}
                                  className={`text-xs ${showDeleteConfirm === index ? 'bg-red-600 hover:bg-red-700' : ''}`}
                                >
                                  {showDeleteConfirm === index ? (
                                    <>
                                      <CheckCircle className="w-3 h-3 ml-1" />
                                      تأكيد
                                    </>
                                  ) : (
                                    <Trash2 className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-1 gap-4">
                                                             {/* معاينة الميزة */}
                               {highlight.title && highlight.title !== "ميزة جديدة" && (
                                 <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                   <h5 className="font-medium text-sm text-gray-600 mb-2">معاينة الميزة:</h5>
                                   <div className="bg-gray-50 rounded-lg p-3">
                                     <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 bg-[#540f6b] text-white rounded-full flex items-center justify-center">
                                         {highlight.icon === "Star" && <Star className="w-5 h-5" />}
                                         {highlight.icon === "Shield" && <Shield className="w-5 h-5" />}
                                         {highlight.icon === "Wifi" && <Wifi className="w-5 h-5" />}
                                         {highlight.icon === "Camera" && <Camera className="w-5 h-5" />}
                                         {highlight.icon === "Users" && <Users className="w-5 h-5" />}
                                         {highlight.icon === "MapPin" && <MapPin className="w-5 h-5" />}
                                         {highlight.icon === "CheckCircle" && <CheckCircle className="w-5 h-5" />}
                                         {highlight.icon === "LucideSnowflake" && <LucideSnowflake className="w-5 h-5" />}
                                         {highlight.icon === "Building2" && <Building2 className="w-5 h-5" />}
                                         {highlight.icon === "Zap" && <Zap className="w-5 h-5" />}
                                         {highlight.icon === "Droplets" && <Droplets className="w-5 h-5" />}
                                         {highlight.icon === "Users2" && <Users2 className="w-5 h-5" />}
                             
                            
                                         {![ "Shield", "Wifi", "Camera", "Users", "MapPin", "CheckCircle", "LucideSnowflake", "Building2", "Zap", "Droplets", "Users2"].includes(highlight.icon) && <Star className="w-5 h-5" />}
                                       </div>
                                       <h4 className="font-semibold text-[#540f6b]">{highlight.title}</h4>
                                     </div>
                                   </div>
                                 </div>
                               )}
                              
                              <div>
                                <Label htmlFor={`highlight-title-${index}`} className="text-sm font-medium">
                                  عنوان الميزة <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id={`highlight-title-${index}`}
                                  placeholder="مثال: موقع استراتيجي"
                                  value={highlight.title}
                                  onChange={(e) => {
                                    if (!data) return
                                    setData(prev => prev ? {
                                      ...prev,
                                      projectHighlights: prev.projectHighlights.map((h, i) => 
                                        i === index ? { ...h, title: e.target.value } : h
                                      )
                                    } : null)
                                  }}
                                  className="mt-1"
                                />
                                                                 <p className="text-xs text-gray-500 mt-1">عنوان الميزة التي ستظهر للمستخدمين</p>
                                 {!highlight.title.trim() && (
                                   <p className="text-xs text-red-500 mt-1">⚠️ العنوان مطلوب</p>
                                 )}
                                 {highlight.title && highlight.title.length > 50 && (
                                   <p className="text-xs text-orange-500 mt-1">⚠️ العنوان طويل جداً (يُنصح بأقل من 50 حرف)</p>
                                 )}
                              </div>
                              
                              <div>
                                <Label htmlFor={`highlight-icon-${index}`} className="text-sm font-medium">
                                  أيقونة الميزة
                                </Label>
                                <select
                                  id={`highlight-icon-${index}`}
                                  value={highlight.icon}
                                  onChange={(e) => {
                                    if (!data) return
                                    setData(prev => prev ? {
                                      ...prev,
                                      projectHighlights: prev.projectHighlights.map((h, i) => 
                                        i === index ? { ...h, icon: e.target.value } : h
                                      )
                                    } : null)
                                  }}
                                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#540f6b] focus:border-transparent"
                                >
                       
                                  <option value="Shield">🛡️ درع</option>
                                  <option value="Wifi">📶 واي فاي</option>
                                  <option value="Camera">📷 كاميرا</option>
                                  <option value="Users">👥 مستخدمين</option>
                                  <option value="MapPin">📍 موقع</option>
                                  <option value="CheckCircle">✅ علامة صح</option>
                                  <option value="LucideSnowflake">❄️ ثلج</option>
                                  <option value="Building2">🏢 مبنى</option>
                                  <option value="Zap">⚡ برق</option>
                                  <option value="Droplets">💧 قطرات</option>
                                  <option value="Users2">👥 مستخدمين 2</option>
         
                      
                                </select>
                                                                 <p className="text-xs text-gray-500 mt-1">اختر الأيقونة المناسبة للميزة</p>
                                 {!highlight.icon && (
                                   <p className="text-xs text-orange-500 mt-1">💡 يُنصح باختيار أيقونة مناسبة للميزة</p>
                                 )}
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* زر الحفظ */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4" />
                                                 {data.projectHighlights.filter(h => !h.title || h.title === "ميزة جديدة").length > 0 ? (
                           <span className="text-orange-600">
                             يوجد {data.projectHighlights.filter(h => !h.title || h.title === "ميزة جديدة").length} ميزة تحتاج تعديل
                           </span>
                         ) : data.projectHighlights.length === 0 ? (
                           <span className="text-red-600">
                             يجب إضافة ميزة واحدة على الأقل
                           </span>
                         ) : (
                           "تأكد من مراجعة جميع البيانات قبل الحفظ"
                         )}
                      </div>
                      <Button 
                        onClick={() => saveSection('project-highlights', data.projectHighlights)} 
                                                 disabled={isSaving || data.projectHighlights.length === 0 || data.projectHighlights.some(h => !h.title.trim())}
                        className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                        size="lg"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 ml-2" />
                            حفظ مميزات المشروع
                                                         {data.projectHighlights.filter(h => !h.title || h.title === "ميزة جديدة").length > 0 && (
                               <Badge variant="secondary" className="mr-2 text-xs">
                                 {data.projectHighlights.filter(h => !h.title || h.title === "ميزة جديدة").length} يحتاج تعديل
                               </Badge>
                             )}
                             {data.projectHighlights.length > 0 && data.projectHighlights.every(h => h.title && h.title !== "ميزة جديدة") && (
                               <Badge variant="outline" className="mr-2 text-xs text-green-600">
                                 جاهز للحفظ
                               </Badge>
                             )}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Gallery Management Tab */}
            {activeTab === "gallery" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    إدارة معرض الصور
                    <Button 
                      onClick={() => {
                        if (!data) return
                        const newImage = {
                          src: "/new-image.jpg",
                          alt: "صورة جديدة",
                          title: "صورة جديدة"
                        }
                        setData(prev => prev ? { 
                          ...prev, 
                          imageCarousel: { 
                            ...prev.imageCarousel, 
                            images: [...prev.imageCarousel.images, newImage] 
                          } 
                        } : null)
                      }}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f]"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة صورة
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="galleryTitle">عنوان المعرض</Label>
                      <Input
                        id="galleryTitle"
                        value={data.imageCarousel.title}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          imageCarousel: { ...prev.imageCarousel, title: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gallerySubtitle">العنوان الفرعي</Label>
                      <Input
                        id="gallerySubtitle"
                        value={data.imageCarousel.subtitle}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          imageCarousel: { ...prev.imageCarousel, subtitle: e.target.value } 
                        } : null)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>الصور</Label>
                    <div className="space-y-4 mt-2">
                      {data.imageCarousel.images.map((image, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">صورة #{index + 1}</h4>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setData(prev => prev ? {
                                  ...prev,
                                  imageCarousel: {
                                    ...prev.imageCarousel,
                                    images: prev.imageCarousel.images.filter((_, i) => i !== index)
                                  }
                                } : null)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <ImageUpload
                                label="صورة المعرض"
                                value={image.src}
                                onChange={(url) => {
                                  setData(prev => prev ? {
                                    ...prev,
                                    imageCarousel: {
                                      ...prev.imageCarousel,
                                      images: prev.imageCarousel.images.map((img, i) => 
                                        i === index ? { ...img, src: url } : img
                                      )
                                    }
                                  } : null)
                                }}
                                aspectRatio="aspect-[16/9]"
                                placeholder="اسحب وأفلت صورة المعرض هنا أو انقر للاختيار"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`image-alt-${index}`}>النص البديل</Label>
                              <Input
                                id={`image-alt-${index}`}
                                value={image.alt}
                                onChange={(e) => {
                                  setData(prev => prev ? {
                                    ...prev,
                                    imageCarousel: {
                                      ...prev.imageCarousel,
                                      images: prev.imageCarousel.images.map((img, i) => 
                                        i === index ? { ...img, alt: e.target.value } : img
                                      )
                                    }
                                  } : null)
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`image-title-${index}`}>العنوان</Label>
                              <Input
                                id={`image-title-${index}`}
                                value={image.title || ''}
                                onChange={(e) => {
                                  setData(prev => prev ? {
                                    ...prev,
                                    imageCarousel: {
                                      ...prev.imageCarousel,
                                      images: prev.imageCarousel.images.map((img, i) => 
                                        i === index ? { ...img, title: e.target.value } : img
                                      )
                                    }
                                  } : null)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('image-carousel', data.imageCarousel)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ معرض الصور
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Section Tab */}
            {/* {activeTab === "contact-section" && (
              <Card>
                <CardHeader>
                  <CardTitle>إدارة قسم التواصل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactSectionTitle">العنوان الرئيسي</Label>
                      <Input
                        id="contactSectionTitle"
                        value={data.contactSection.title}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          contactSection: { ...prev.contactSection, title: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactSectionSubtitle">العنوان الفرعي</Label>
                      <Input
                        id="contactSectionSubtitle"
                        value={data.contactSection.subtitle}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          contactSection: { ...prev.contactSection, subtitle: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactSectionPhone">رقم الهاتف</Label>
                      <Input
                        id="contactSectionPhone"
                        value={data.contactSection.phone}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          contactSection: { ...prev.contactSection, phone: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactSectionWhatsapp">رقم الواتساب</Label>
                      <Input
                        id="contactSectionWhatsapp"
                        value={data.contactSection.whatsapp}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          contactSection: { ...prev.contactSection, whatsapp: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="contactSectionEmail">البريد الإلكتروني</Label>
                      <Input
                        id="contactSectionEmail"
                        type="email"
                        value={data.contactSection.email}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          contactSection: { ...prev.contactSection, email: e.target.value } 
                        } : null)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>ساعات العمل</Label>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="workingHoursWeekdays">أيام الأسبوع</Label>
                        <Input
                          id="workingHoursWeekdays"
                          value={data.contactSection.workingHours.weekdays}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            contactSection: { 
                              ...prev.contactSection, 
                              workingHours: { ...prev.contactSection.workingHours, weekdays: e.target.value } 
                            } 
                          } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="workingHoursFriday">يوم الجمعة</Label>
                        <Input
                          id="workingHoursFriday"
                          value={data.contactSection.workingHours.friday}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            contactSection: { 
                              ...prev.contactSection, 
                              workingHours: { ...prev.contactSection.workingHours, friday: e.target.value } 
                            } 
                          } : null)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>إعدادات النموذج</Label>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showName"
                          checked={data.contactSection.formSettings.showName}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            contactSection: { 
                              ...prev.contactSection, 
                              formSettings: { ...prev.contactSection.formSettings, showName: e.target.checked } 
                            } 
                          } : null)}
                        />
                        <Label htmlFor="showName">إظهار حقل الاسم</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showPhone"
                          checked={data.contactSection.formSettings.showPhone}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            contactSection: { 
                              ...prev.contactSection, 
                              formSettings: { ...prev.contactSection.formSettings, showPhone: e.target.checked } 
                            } 
                          } : null)}
                        />
                        <Label htmlFor="showPhone">إظهار حقل الهاتف</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showEmail"
                          checked={data.contactSection.formSettings.showEmail}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            contactSection: { 
                              ...prev.contactSection, 
                              formSettings: { ...prev.contactSection.formSettings, showEmail: e.target.checked } 
                            } 
                          } : null)}
                        />
                        <Label htmlFor="showEmail">إظهار حقل البريد الإلكتروني</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showMessage"
                          checked={data.contactSection.formSettings.showMessage}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            contactSection: { 
                              ...prev.contactSection, 
                              formSettings: { ...prev.contactSection.formSettings, showMessage: e.target.checked } 
                            } 
                          } : null)}
                        />
                        <Label htmlFor="showMessage">إظهار حقل الرسالة</Label>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('contact-section', data.contactSection)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ قسم التواصل
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* Trust Indicators Tab */}
            {activeTab === "trust" && (
              <div className="space-y-6">
                {/* معلومات القسم */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    يمكنك إدارة الضمانات وعوامل الثقة التي تظهر للمستخدمين لبناء الثقة في المشروع
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#540f6b]" />
                      إعدادات القسم الرئيسي
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="trustTitle" className="text-sm font-medium">
                          العنوان الرئيسي <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="trustTitle"
                          placeholder="مثال: ضماناتنا لك"
                          value={data.trustIndicators.title}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            trustIndicators: { ...prev.trustIndicators, title: e.target.value } 
                          } : null)}
                          className="mt-1"
                        />
                                                 <p className="text-xs text-gray-500 mt-1">العنوان الرئيسي الذي يظهر في أعلى القسم</p>
                         {!data.trustIndicators.title.trim() && (
                           <p className="text-xs text-red-500 mt-1">⚠️ العنوان مطلوب</p>
                         )}
                       </div>
                      <div>
                        <Label htmlFor="trustSubtitle" className="text-sm font-medium">
                          العنوان الفرعي
                        </Label>
                        <Input
                          id="trustSubtitle"
                          placeholder="مثال: نضمن لك الأمان والجودة"
                          value={data.trustIndicators.subtitle}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            trustIndicators: { ...prev.trustIndicators, subtitle: e.target.value } 
                          } : null)}
                          className="mt-1"
                        />
                                                 <p className="text-xs text-gray-500 mt-1">نص توضيحي يظهر تحت العنوان الرئيسي</p>
                         {data.trustIndicators.subtitle && data.trustIndicators.subtitle.length > 150 && (
                           <p className="text-xs text-orange-500 mt-1">⚠️ النص طويل جداً (يُنصح بأقل من 150 حرف)</p>
                         )}
                       </div>
                    </div>
                  </CardContent>
                </Card>

                {/* إدارة الضمانات */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#540f6b]" />
                        إدارة الضمانات
                        <Badge variant="secondary" className="mr-2">
                          {data.trustIndicators.guarantees.length} ضمان
                          {data.trustIndicators.guarantees.length > 0 && (
                            <span className="mr-1">
                              ({data.trustIndicators.guarantees.filter(g => g.title && g.title !== "ضمان جديد").length} مكتمل)
                            </span>
                          )}
                        </Badge>
                      </CardTitle>
                      <Button 
                        onClick={() => {
                          if (!data) return
                          const newGuarantee = {
                            icon: "Shield",
                            title: "ضمان جديد",
                            subtitle: "نص الضمان",
                            description: "تفاصيل الضمان"
                          }
                          setData(prev => prev ? { 
                            ...prev, 
                            trustIndicators: { 
                              ...prev.trustIndicators, 
                              guarantees: [...prev.trustIndicators.guarantees, newGuarantee] 
                            } 
                          } : null)
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-[#540f6b] hover:bg-[#540f6b]/90 text-white border-[#540f6b]"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة ضمان جديد
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {data.trustIndicators.guarantees.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-xl font-medium mb-2">لا توجد ضمانات مضافة حالياً</p>
                        <p className="text-sm mb-6">اضغط على "إضافة ضمان جديد" لبدء إضافة الضمانات</p>
                        <div className="bg-[#f5f3f0] border border-[#e5e1dc] rounded-2xl p-6 text-sm text-[#2c2c2c] max-w-md mx-auto">
                          <p className="font-medium mb-3 text-[#540f6b]">💡 نصائح لإضافة ضمانات فعالة:</p>
                          <ul className="text-right space-y-2">
                            <li className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-[#540f6b]" />
                              ضمان الجودة والبناء
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#540f6b]" />
                              ضمان التسليم في الوقت المحدد
                            </li>
                            <li className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-[#540f6b]" />
                              ضمان خدمة ما بعد البيع
                            </li>
                            <li className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-[#540f6b]" />
                              ضمان الأمان والحماية
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {data.trustIndicators.guarantees.map((guarantee, index) => {
                          const IconComponent = iconMap[guarantee.icon] || Shield
                          return (
                            <div key={index} className="border border-[#e5e1dc] rounded-2xl p-6 bg-[#f5f3f0]/50">
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-[#540f6b] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <h4 className="font-semibold text-lg text-[#2c2c2c]">ضمان #{index + 1}</h4>
                                  {guarantee.title && guarantee.title !== "ضمان جديد" && (
                                    <Badge variant="outline" className="text-xs border-[#540f6b] text-[#540f6b]">
                                      {guarantee.title}
                                    </Badge>
                                  )}
                                  {(!guarantee.title || guarantee.title === "ضمان جديد") && (
                                    <Badge variant="secondary" className="text-xs text-orange-600 bg-orange-50">
                                      يحتاج تعديل
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (index > 0) {
                                        setData(prev => prev ? {
                                          ...prev,
                                          trustIndicators: {
                                            ...prev.trustIndicators,
                                            guarantees: prev.trustIndicators.guarantees.map((g, i) => {
                                              if (i === index - 1) return prev.trustIndicators.guarantees[index]
                                              if (i === index) return prev.trustIndicators.guarantees[index - 1]
                                              return g
                                            })
                                          }
                                        } : null)
                                      }
                                    }}
                                    disabled={index === 0}
                                    className="text-xs border-[#540f6b] text-[#540f6b] hover:bg-[#540f6b] hover:text-white"
                                  >
                                    ↑
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (index < data.trustIndicators.guarantees.length - 1) {
                                        setData(prev => prev ? {
                                          ...prev,
                                          trustIndicators: {
                                            ...prev.trustIndicators,
                                            guarantees: prev.trustIndicators.guarantees.map((g, i) => {
                                              if (i === index) return prev.trustIndicators.guarantees[index + 1]
                                              if (i === index + 1) return prev.trustIndicators.guarantees[index]
                                              return g
                                            })
                                          }
                                        } : null)
                                      }
                                    }}
                                    disabled={index === data.trustIndicators.guarantees.length - 1}
                                    className="text-xs border-[#540f6b] text-[#540f6b] hover:bg-[#540f6b] hover:text-white"
                                  >
                                    ↓
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (showDeleteConfirm === index) {
                                        setData(prev => prev ? {
                                          ...prev,
                                          trustIndicators: {
                                            ...prev.trustIndicators,
                                            guarantees: prev.trustIndicators.guarantees.filter((_, i) => i !== index)
                                          }
                                        } : null)
                                        setShowDeleteConfirm(null)
                                      } else {
                                        setShowDeleteConfirm(index)
                                        setTimeout(() => setShowDeleteConfirm(null), 3000)
                                      }
                                    }}
                                    className={`text-xs ${showDeleteConfirm === index ? 'bg-red-600 hover:bg-red-700' : ''}`}
                                  >
                                    {showDeleteConfirm === index ? (
                                      <>
                                        <CheckCircle className="w-3 h-3 ml-1" />
                                        تأكيد
                                      </>
                                    ) : (
                                      <Trash2 className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-6">
                                {/* معاينة الضمان */}
                                {guarantee.title && guarantee.title !== "ضمان جديد" && (
                                  <div className="bg-white border border-[#e5e1dc] rounded-2xl p-4">
                                    <h5 className="font-medium text-sm text-gray-600 mb-3">معاينة الضمان:</h5>
                                    <div className="bg-[#f5f3f0] rounded-2xl p-4 border border-[#e5e1dc]">
                                      <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 flex items-center justify-center bg-white rounded-full w-10 h-10 border border-[#e5e1dc]">
                                          <IconComponent className="w-5 h-5 text-[#540f6b]" />
                                        </div>
                                                                                 <span className="text-[#2c2c2c] text-sm font-medium">{guarantee.subtitle || guarantee.title}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="space-y-4">
                                  {/* اختيار الأيقونة */}
                                  <div>
                                    <Label htmlFor={`guarantee-icon-${index}`} className="text-sm font-medium text-[#2c2c2c]">
                                      أيقونة الضمان <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                      value={guarantee.icon}
                                      onValueChange={(value) => {
                                        setData(prev => prev ? {
                                          ...prev,
                                          trustIndicators: {
                                            ...prev.trustIndicators,
                                            guarantees: prev.trustIndicators.guarantees.map((g, i) => 
                                              i === index ? { ...g, icon: value } : g
                                            )
                                          }
                                        } : null)
                                      }}
                                    >
                                      <SelectTrigger className="mt-1 border-[#e5e1dc]">
                                        <SelectValue placeholder="اختر الأيقونة" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Shield">
                                          <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-[#540f6b]" />
                                            درع الحماية
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Building2">
                                          <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-[#540f6b]" />
                                            البناء
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="CheckCircle">
                                          <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-[#540f6b]" />
                                            علامة صح
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Zap">
                                          <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-[#540f6b]" />
                                            البرق
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Users">
                                          <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-[#540f6b]" />
                                            المستخدمين
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="MapPin">
                                          <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-[#540f6b]" />
                                            الموقع
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Camera">
                                          <div className="flex items-center gap-2">
                                            <Camera className="w-4 h-4 text-[#540f6b]" />
                                            الكاميرا
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Wifi">
                                          <div className="flex items-center gap-2">
                                            <Wifi className="w-4 h-4 text-[#540f6b]" />
                                            الواي فاي
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="LucideSnowflake">
                                          <div className="flex items-center gap-2">
                                            <LucideSnowflake className="w-4 h-4 text-[#540f6b]" />
                                            الثلج
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Droplets">
                                          <div className="flex items-center gap-2">
                                            <Droplets className="w-4 h-4 text-[#540f6b]" />
                                            الماء
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="Users2">
                                          <div className="flex items-center gap-2">
                                            <Users2 className="w-4 h-4 text-[#540f6b]" />
                                            مجموعة مستخدمين
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 mt-1">اختر الأيقونة المناسبة للضمان</p>
                                  </div>
                                  
                                  {/* عنوان الضمان */}
                                  <div>
                                    <Label htmlFor={`guarantee-title-${index}`} className="text-sm font-medium text-[#2c2c2c]">
                                      عنوان الضمان <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id={`guarantee-title-${index}`}
                                      placeholder="مثال: ضمان الجودة"
                                      value={guarantee.title}
                                      onChange={(e) => {
                                        setData(prev => prev ? {
                                          ...prev,
                                          trustIndicators: {
                                            ...prev.trustIndicators,
                                            guarantees: prev.trustIndicators.guarantees.map((g, i) => 
                                              i === index ? { ...g, title: e.target.value } : g
                                            )
                                          }
                                        } : null)
                                      }}
                                      className="mt-1 border-[#e5e1dc] focus:border-[#540f6b]"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">العنوان الرئيسي للضمان</p>
                                    {!guarantee.title.trim() && (
                                      <p className="text-xs text-red-500 mt-1"> العنوان مطلوب</p>
                                    )}
                                  </div>
                                  
                                                                     {/* نص الضمان */}
                                   <div>
                                     <Label htmlFor={`guarantee-subtitle-${index}`} className="text-sm font-medium text-[#2c2c2c]">
                                       نص الضمان <span className="text-red-500">*</span>
                                     </Label>
                                     <Input
                                       id={`guarantee-subtitle-${index}`}
                                       placeholder="مثال: 15 سنة ضمان على الهيكل الإنشائي"
                                       value={guarantee.subtitle}
                                       onChange={(e) => {
                                         setData(prev => prev ? {
                                           ...prev,
                                           trustIndicators: {
                                             ...prev.trustIndicators,
                                             guarantees: prev.trustIndicators.guarantees.map((g, i) => 
                                               i === index ? { ...g, subtitle: e.target.value } : g
                                             )
                                           }
                                         } : null)
                                       }}
                                       className="mt-1 border-[#e5e1dc] focus:border-[#540f6b]"
                                     />
                                     <p className="text-xs text-gray-500 mt-1">النص الذي سيظهر بجانب الأيقونة</p>
                                     {!guarantee.subtitle.trim() && (
                                       <p className="text-xs text-red-500 mt-1"> النص مطلوب</p>
                                     )}
                                     {guarantee.subtitle && guarantee.subtitle.length > 80 && (
                                       <p className="text-xs text-orange-500 mt-1"> النص طويل جداً (يُنصح بأقل من 80 حرف)</p>
                                     )}
                                   </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

   

                {/* زر الحفظ */}
                <Card>
                  <CardContent className="pt-6">
                                      <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertCircle className="w-4 h-4" />
                      {data.trustIndicators.guarantees.filter(g => !g.title || g.title === "ضمان جديد").length > 0 ? (
                        <span className="text-orange-600">
                          يوجد {data.trustIndicators.guarantees.filter(g => !g.title || g.title === "ضمان جديد").length} ضمان يحتاج تعديل
                        </span>
                      ) : (
                        "تأكد من مراجعة جميع البيانات قبل الحفظ"
                      )}
                    </div>
                                               <Button 
                           onClick={() => saveSection('trust-indicators', data.trustIndicators)} 
                           disabled={isSaving || !data.trustIndicators.title.trim() || data.trustIndicators.guarantees.length === 0}
                           className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                           size="lg"
                         >
                           {isSaving ? (
                             <>
                               <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                               جاري الحفظ...
                             </>
                           ) : (
                             <>
                               <Save className="w-4 h-4 ml-2" />
                               حفظ الضمانات وعوامل الثقة
                               {data.trustIndicators.guarantees.filter(g => !g.title || g.title === "ضمان جديد").length > 0 && (
                                 <Badge variant="secondary" className="mr-2 text-xs">
                                   {data.trustIndicators.guarantees.filter(g => !g.title || g.title === "ضمان جديد").length} يحتاج تعديل
                                 </Badge>
                               )}
                             </>
                           )}
                         </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* WhatsApp CTA Tab */}
            {activeTab === "whatsapp-cta" && (
              <Card>
                <CardHeader>
                  <CardTitle>إدارة زر الواتساب الرئيسي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="whatsappCtaTitle">العنوان الرئيسي</Label>
                      <Input
                        id="whatsappCtaTitle"
                        value={data.whatsappCTA.title}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          whatsappCTA: { ...prev.whatsappCTA, title: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsappCtaSubtitle">العنوان الفرعي</Label>
                      <Input
                        id="whatsappCtaSubtitle"
                        value={data.whatsappCTA.subtitle}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          whatsappCTA: { ...prev.whatsappCTA, subtitle: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsappCtaPhone">رقم الواتساب</Label>
                      <Input
                        id="whatsappCtaPhone"
                        value={data.whatsappCTA.phone}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          whatsappCTA: { ...prev.whatsappCTA, phone: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsappCtaVariant">نوع الزر</Label>
                      <select
                        id="whatsappCtaVariant"
                        value={data.whatsappCTA.variant}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          whatsappCTA: { ...prev.whatsappCTA, variant: e.target.value as 'primary' | 'secondary' | 'minimal' } 
                        } : null)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="primary">أساسي</option>
                        <option value="secondary">ثانوي</option>
                        <option value="minimal">بسيط</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="whatsappCtaMessage">الرسالة المرسلة</Label>
                    <Textarea
                      id="whatsappCtaMessage"
                      value={data.whatsappCTA.message}
                      onChange={(e) => setData(prev => prev ? { 
                        ...prev, 
                        whatsappCTA: { ...prev.whatsappCTA, message: e.target.value } 
                      } : null)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>إعدادات العرض</Label>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showPhoneCta"
                          checked={data.whatsappCTA.showPhone}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            whatsappCTA: { ...prev.whatsappCTA, showPhone: e.target.checked } 
                          } : null)}
                        />
                        <Label htmlFor="showPhoneCta">إظهار رقم الهاتف</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showMessageCta"
                          checked={data.whatsappCTA.showMessage}
                          onChange={(e) => setData(prev => prev ? { 
                            ...prev, 
                            whatsappCTA: { ...prev.whatsappCTA, showMessage: e.target.checked } 
                          } : null)}
                        />
                        <Label htmlFor="showMessageCta">إظهار الرسالة</Label>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('whatsapp-cta', data.whatsappCTA)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ زر الواتساب
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* WhatsApp Section Tab */}
            {/* {activeTab === "whatsapp-section" && (
              <Card>
                <CardHeader>
                  <CardTitle>إدارة قسم الواتساب التفاعلي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="whatsappSectionTitle">العنوان الرئيسي</Label>
                      <Input
                        id="whatsappSectionTitle"
                        value={data.whatsappSection.title}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          whatsappSection: { ...prev.whatsappSection, title: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsappSectionSubtitle">العنوان الفرعي</Label>
                      <Input
                        id="whatsappSectionSubtitle"
                        value={data.whatsappSection.subtitle}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          whatsappSection: { ...prev.whatsappSection, subtitle: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsappSectionPhone">رقم الواتساب</Label>
                      <Input
                        id="whatsappSectionPhone"
                        value={data.whatsappSection.phone}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          whatsappSection: { ...prev.whatsappSection, phone: e.target.value } 
                        } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsappSectionMessage">رسالة الواتساب</Label>
                      <Input
                        id="whatsappSectionMessage"
                        value={data.whatsappSection.message}
                        onChange={(e) => setData(prev => prev ? { 
                          ...prev, 
                          whatsappSection: { ...prev.whatsappSection, message: e.target.value } 
                        } : null)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>المميزات</Label>
                      <Button 
                        onClick={() => {
                          if (!data) return
                          const newFeature = {
                            icon: "Star",
                            title: "ميزة جديدة",
                            description: "وصف الميزة"
                          }
                          setData(prev => prev ? { 
                            ...prev, 
                            whatsappSection: { 
                              ...prev.whatsappSection, 
                              features: [...prev.whatsappSection.features, newFeature] 
                            } 
                          } : null)
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة ميزة
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {data.whatsappSection.features.map((feature, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">ميزة #{index + 1}</h4>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setData(prev => prev ? {
                                  ...prev,
                                  whatsappSection: {
                                    ...prev.whatsappSection,
                                    features: prev.whatsappSection.features.filter((_, i) => i !== index)
                                  }
                                } : null)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                                                     <div className="grid md:grid-cols-2 gap-4">
                             <div>
                               <Label htmlFor={`wafeat-title-${index}`}>العنوان</Label>
                               <Input
                                 id={`wafeat-title-${index}`}
                                 value={feature.title}
                                 onChange={(e) => {
                                   setData(prev => prev ? {
                                     ...prev,
                                     whatsappSection: {
                                       ...prev.whatsappSection,
                                       features: prev.whatsappSection.features.map((f, i) => 
                                         i === index ? { ...f, title: e.target.value } : f
                                       )
                                     }
                                   } : null)
                                 }}
                               />
                             </div>
                             <div>
                               <Label htmlFor={`wafeat-description-${index}`}>الوصف</Label>
                               <Input
                                 id={`wafeat-description-${index}`}
                                 value={feature.description}
                                 onChange={(e) => {
                                   setData(prev => prev ? {
                                     ...prev,
                                     whatsappSection: {
                                       ...prev.whatsappSection,
                                       features: prev.whatsappSection.features.map((f, i) => 
                                         i === index ? { ...f, description: e.target.value } : f
                                       )
                                     }
                                   } : null)
                                 }}
                               />
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => saveSection('whatsapp-section', data.whatsappSection)} 
                      disabled={isSaving}
                      className="bg-[#540f6b] hover:bg-[#4a0d5f] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ قسم الواتساب
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* Profile Section */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <UserProfile />
              </div>
            )}

            {/* Users Management Section */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <UserManagement />
              </div>
            )}

            {/* Default content for other tabs */}
            {!["project", "apartments", "hero", "contact", "social", "strategic", "highlights", "gallery", "contact-section", "trust", "whatsapp-cta", "whatsapp-section", "location", "profile", "users"].includes(activeTab) && (
              <Card>
                <CardHeader>
                  <CardTitle>مرحباً بك في لوحة التحكم</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">سيتم إضافة المحتوى هنا قريباً...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
