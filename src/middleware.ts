import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (!process.env.NEXTAUTH_SECRET) {
        console.error(' NEXTAUTH_SECRET is not defined');
        return NextResponse.redirect(new URL('/error', req.url));
    }

    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            console.warn(`Unauthorized access to ${pathname}. Redirecting to /login`);
            return NextResponse.redirect(new URL('/login', req.url));
        }


        const role = token.role || 'user';
        const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

        if (isAdminRoute && role !== 'admin') {
            console.warn(`Access denied to ${pathname} for user ${token.email}`);
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.error(`Middleware error:`, error);
        return NextResponse.redirect(new URL('/error', req.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
