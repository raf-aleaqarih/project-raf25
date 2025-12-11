import { NextRequest, NextResponse } from 'next/server'
import { jwtService } from './jwt-service'
import connectDB from './mongodb'
import { User } from '@/lib/models/User'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
    name: string
  }
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: {
    requireAdmin?: boolean
    requireAuth?: boolean
  } = { requireAuth: true }
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      // Skip auth check if not required
      if (!options.requireAuth) {
        return handler(req as AuthenticatedRequest)
      }

      // Get token from cookies or Authorization header
      const token = req.cookies.get('accessToken')?.value || 
                   req.headers.get('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return NextResponse.json(
          { error: 'Access token required' },
          { status: 401 }
        )
      }

      // Verify token
      const decoded = jwtService.verifyToken(token)
      if (!decoded || !decoded.userId) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Connect to database and get user
      await connectDB()
      const user = await User.findById(decoded.userId).select('-password')
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        )
      }

      if (!user.isActive) {
        return NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 403 }
        )
      }

      // Check admin role if required
      if (options.requireAdmin && user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      // Add user to request
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name
      }

      return handler(authenticatedReq)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

export function requireAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(handler, { requireAuth: true })
}

export function requireAdmin(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(handler, { requireAuth: true, requireAdmin: true })
}

// Rate limiting middleware
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    maxRequests?: number
    windowMs?: number
  } = { maxRequests: 100, windowMs: 15 * 60 * 1000 } // 100 requests per 15 minutes
) {
  return async (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowMs = options.windowMs || 15 * 60 * 1000
    const maxRequests = options.maxRequests || 100

    // Clean up expired entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key)
      }
    }

    const current = rateLimitMap.get(ip)
    
    if (!current) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    } else if (now > current.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    } else {
      current.count++
      if (current.count > maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
    }

    return handler(req)
  }
}

// CORS middleware
export function withCORS(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    origin?: string | string[]
    methods?: string[]
    allowedHeaders?: string[]
  } = {}
) {
  return async (req: NextRequest) => {
    const response = await handler(req)
    
    // Set CORS headers
    const origin = options.origin || '*'
    const methods = options.methods || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    const allowedHeaders = options.allowedHeaders || [
      'Content-Type',
      'Authorization',
      'X-Requested-With'
    ]

    if (typeof origin === 'string') {
      response.headers.set('Access-Control-Allow-Origin', origin)
    } else if (Array.isArray(origin)) {
      const requestOrigin = req.headers.get('origin')
      if (requestOrigin && origin.includes(requestOrigin)) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin)
      }
    }

    response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
    response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '))
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    return response
  }
}

// Input validation middleware
export function withValidation<T>(
  handler: (req: AuthenticatedRequest, validatedData: T) => Promise<NextResponse>,
  schema: any // Zod schema
) {
  return async (req: AuthenticatedRequest) => {
    try {
      const body = await req.json()
      const validatedData = schema.parse(body)
      return handler(req, validatedData)
    } catch (error: any) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors || error.message
        },
        { status: 400 }
      )
    }
  }
}

// Logging middleware
export function withLogging(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    logRequests?: boolean
    logResponses?: boolean
  } = { logRequests: true, logResponses: false }
) {
  return async (req: NextRequest) => {
    const start = Date.now()
    
    if (options.logRequests) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    }

    const response = await handler(req)
    
    if (options.logResponses) {
      const duration = Date.now() - start
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url} - ${response.status} (${duration}ms)`
      )
    }

    return response
  }
}

// Combine multiple middlewares
export function combineMiddlewares(
  ...middlewares: Array<(handler: any) => any>
) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}