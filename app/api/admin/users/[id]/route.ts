import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { jwtService } from '@/lib/jwt-service'
import { z } from 'zod'
export const runtime = 'nodejs'

const updateUserSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم يجب أن يكون أقل من 50 حرف').optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional(),
  role: z.enum(['admin', 'user']).optional(),
  isActive: z.boolean().optional()
})

// GET - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

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

    const user = await User.findById(id).select('-password')
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

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
    const updateData = updateUserSchema.parse(body)

    // Check if user exists
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    // Check if email is being changed and if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email })
      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: 'البريد الإلكتروني مستخدم بالفعل'
        }, { status: 400 })
      }
    }

    // Update user
    Object.assign(user, updateData)
    await user.save()

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المستخدم بنجاح',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

  } catch (error) {
    console.error('Update user error:', error)
    
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

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

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

    // Prevent admin from deleting themselves
    if (id === payload.userId) {
      return NextResponse.json({
        success: false,
        message: 'لا يمكنك حذف حسابك الخاص'
      }, { status: 400 })
    }

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'المستخدم غير موجود'
      }, { status: 404 })
    }

    await User.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 })
  }
}
