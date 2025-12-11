import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, requireAdmin } from '@/lib/auth-middleware'
import connectDB from '@/lib/mongodb'
import SystemSetting from '@/lib/models/SystemSetting'

// Settings validation schema
const settingsSchema = z.object({
  general: z.object({
    siteName: z.string().min(1, 'Site name is required'),
    siteDescription: z.string().min(1, 'Site description is required'),
    contactEmail: z.string().email('Invalid email format'),
    supportPhone: z.string().min(1, 'Support phone is required'),
    maintenanceMode: z.boolean(),
    registrationEnabled: z.boolean()
  }),
  security: z.object({
    passwordMinLength: z.number().min(6).max(20),
    sessionTimeout: z.number().min(5).max(1440),
    maxLoginAttempts: z.number().min(3).max(10),
    twoFactorEnabled: z.boolean(),
    ipWhitelist: z.array(z.string()).optional()
  }),
  notifications: z.object({
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    adminAlerts: z.boolean(),
    userWelcomeEmail: z.boolean()
  }),
  appearance: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    logoUrl: z.string().url().optional().or(z.literal('')),
    faviconUrl: z.string().url().optional().or(z.literal('')),
    customCSS: z.string().optional()
  }),
  integrations: z.object({
    googleAnalytics: z.string().optional(),
    facebookPixel: z.string().optional(),
    whatsappNumber: z.string().optional(),
    socialMediaLinks: z.object({
      facebook: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      instagram: z.string().url().optional().or(z.literal('')),
      linkedin: z.string().url().optional().or(z.literal(''))
    })
  })
})

// GET - Retrieve system settings
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    // Verify admin access
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    // Ensure DB connection and get latest settings document
    await connectDB()
    const doc = await SystemSetting?.findOne({}).sort({ updatedAt: -1 }).lean()

    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = {
        general: {
          siteName: 'مشروع جدة السكني',
          siteDescription: 'أفضل المشاريع السكنية في جدة',
          contactEmail: 'info@jeddah-residential.com',
          supportPhone: '+966 12 345 6789',
          maintenanceMode: false,
          registrationEnabled: true
        },
        security: {
          passwordMinLength: 8,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          twoFactorEnabled: false,
          ipWhitelist: []
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          adminAlerts: true,
          userWelcomeEmail: true
        },
        appearance: {
          theme: 'light',
          primaryColor: '#3b82f6',
          logoUrl: '',
          faviconUrl: '',
          customCSS: ''
        },
        integrations: {
          googleAnalytics: '',
          facebookPixel: '',
          whatsappNumber: '+966501234567',
          socialMediaLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: defaultSettings
      })
    }

    return NextResponse.json({
      success: true,
      data: doc?.settings
    })

  } catch (error) {
    console.error('Settings retrieval error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve settings' 
      },
      { status: 500 }
    )
  }
}

// PUT - Update system settings
export async function PUT(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    // Verify admin access
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const body = await request.json()

    // Validate settings data
    const validatedSettings = settingsSchema.parse(body)

    // Upsert settings document
    await connectDB()
    const updatedDoc = await SystemSetting?.findOneAndUpdate(
      {},
      { settings: validatedSettings },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedDoc?.settings
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Settings update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update settings' 
      },
      { status: 500 }
    )
  }
}

// POST - Reset settings to defaults
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    // Verify admin access
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const defaultSettings = {
      general: {
        siteName: 'مشروع جدة السكني',
        siteDescription: 'أفضل المشاريع السكنية في جدة',
        contactEmail: 'info@jeddah-residential.com',
        supportPhone: '+966 12 345 6789',
        maintenanceMode: false,
        registrationEnabled: true
      },
      security: {
        passwordMinLength: 8,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        twoFactorEnabled: false,
        ipWhitelist: []
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        adminAlerts: true,
        userWelcomeEmail: true
      },
      appearance: {
        theme: 'light',
        primaryColor: '#3b82f6',
        logoUrl: '',
        faviconUrl: '',
        customCSS: ''
      },
      integrations: {
        googleAnalytics: '',
        facebookPixel: '',
        whatsappNumber: '+966501234567',
        socialMediaLinks: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: ''
        }
      }
    }

    // Upsert defaults
    await connectDB()
    const resetDoc = await SystemSetting?.findOneAndUpdate(
      {},
      { settings: defaultSettings },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Settings reset to defaults successfully',
      data: resetDoc?.settings
    })

  } catch (error) {
    console.error('Settings reset error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to reset settings' 
      },
      { status: 500 }
    )
  }
}

// PATCH - Update specific setting section
export async function PATCH(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) return rateLimitResult

    // Verify admin access
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const body = await request.json()
    const { section, data } = body

    if (!section || !data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Section and data are required' 
        },
        { status: 400 }
      )
    }

    await connectDB()
    const currentDoc = await SystemSetting?.findOne({}).sort({ updatedAt: -1 }).lean()

    if (!currentDoc) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No settings found' 
        },
        { status: 404 }
      )
    }

    // Update specific section
    const updatedSettings = {
      ...(currentDoc.settings as any),
      [section]: {
        ...(currentDoc.settings as any)[section],
        ...data
      }
    }

    // Validate updated settings
    const validatedSettings = settingsSchema.parse(updatedSettings)

    // Update in database
    const resultDoc = await SystemSetting?.findOneAndUpdate(
      {},
      { settings: validatedSettings },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      success: true,
      message: `${section} settings updated successfully`,
      data: resultDoc?.settings
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Settings partial update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update settings' 
      },
      { status: 500 }
    )
  }
}