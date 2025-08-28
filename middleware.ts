import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/',
  '/chat(.*)',
  '/companies(.*)',
  '/bancos(.*)',
  '/automations(.*)',
  '/whatsapp(.*)'
])

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)'
])

export default clerkMiddleware((auth, req) => {
  try {
    if (isPublicRoute(req)) {
      return
    }

    if (isProtectedRoute(req)) {
      const { userId } = auth()
      
      if (!userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
      }
    }
  } catch (error) {
    console.error('Middleware error:', error)
    // Em caso de erro, redirecionar para sign-in
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}