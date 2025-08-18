import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Validate environment variable
    if (!NEXTAUTH_SECRET) {
        console.error('NEXTAUTH_SECRET is not defined');
        return NextResponse.redirect(new URL('/error', req.url));
    }

    // Skip middleware for static files and auth routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    try {
        // Get JWT token
        const token = await getToken({
            req,
            secret: NEXTAUTH_SECRET,
            secureCookie: process.env.NODE_ENV === 'production', // Use secure cookies in production
        });

        // Log token for debugging (avoid in production for sensitive data)
        if (process.env.NODE_ENV !== 'production') {
            console.log('Token:', token);
        }

        // Redirect to login if no valid token
        if (!token) {
            console.warn(`Unauthorized access to ${pathname}. Redirecting to /login`);
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Check role-based access for admin routes
        const role = token.role ?? 'user'; // Fallback to 'user' if role is undefined
        const isAdminRoute =
            pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

        if (isAdminRoute && role !== 'admin') {
            console.warn(`Access denied to ${pathname} for user with ID ${token.id}`);
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/error', req.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};