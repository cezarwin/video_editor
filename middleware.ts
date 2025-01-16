import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import CryptoJS from 'crypto-js'
import { SECRET } from './config.mjs'

// Add paths that don't require authentication
const publicPaths = ['/', '/api/auth/signin']

function getUserFromCookie(request: NextRequest) {
    try {
        console.log('Cookies:', request.cookies.getAll()) // Debug log
        const userCookie = request.cookies.get('user')
        console.log('User cookie:', userCookie) // Debug log

        if (!userCookie?.value) {
            console.log('No user cookie found') // Debug log
            return null
        }

        const decrypted = CryptoJS.AES.decrypt(userCookie.value, SECRET).toString(CryptoJS.enc.Utf8)
        if (!decrypted) {
            console.log('Could not decrypt cookie') // Debug log
            return null
        }

        const user = JSON.parse(decrypted)
        console.log('Parsed user:', user) // Debug log
        return user
    } catch (e) {
        console.error('Error getting user from cookie:', e)
        return null
    }
}

export function middleware(request: NextRequest) {
    console.log('Middleware running for path:', request.nextUrl.pathname) // Debug log

    const path = request.nextUrl.pathname

    if (publicPaths.includes(path)) {
        console.log('Public path, allowing access') // Debug log
        return NextResponse.next()
    }

    const user = getUserFromCookie(request)
    if (!user) {
        console.log('No user found, redirecting to login') // Debug log
        const url = new URL('/', request.url)
        url.searchParams.set('returnUrl', path)
        return NextResponse.redirect(url)
    }

    console.log('User authenticated, proceeding') // Debug log
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|images|favicon.ico).*)',
    ],
} 