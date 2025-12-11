import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { jwtService } from '@/lib/jwt-service'
import { z } from 'zod'
export const runtime = 'nodejs'

const createUserSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم يجب أن يكون أقل من 50 حرف'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة السر يجب أن تكون 6 أحرف على الأقل'),
  role: z.enum(['admin', 'user']).default('user')
})

// GET - Get all users
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

    const users = await User.find({}).select('-password').sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      users
    })

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, email, password, role } = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'البريد الإلكتروني مستخدم بالفعل'
      }, { status: 400 })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role
    })

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المستخدم بنجاح',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('Create user error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'البيانات المدخلة غير صحيحة',
        errors: error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
