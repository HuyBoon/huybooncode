// app/api/health/route.ts - Health check endpoint
import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/libs/dbConnection';
import { cache } from '@/libs/cache';

export async function GET(request: NextRequest) {
    const start = Date.now();

    try {
        // Check database health
        const dbHealth = await checkDatabaseHealth();

        // Check cache
        const cacheStats = cache.getStats();

        // System info
        const systemInfo = {
            nodeVersion: process.version,
            platform: process.platform,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV,
        };

        const responseTime = Date.now() - start;

        // Determine overall health status
        const isHealthy = dbHealth.mongodb && dbHealth.mongoose;
        const status = isHealthy ? 'healthy' : 'degraded';

        const healthData = {
            status,
            timestamp: new Date().toISOString(),
            responseTime,
            database: {
                mongodb: dbHealth.mongodb,
                mongoose: dbHealth.mongoose,
                latency: dbHealth.latency,
            },
            cache: {
                enabled: true,
                stats: cacheStats,
            },
            system: systemInfo,
        };

        return NextResponse.json(healthData, {
            status: isHealthy ? 200 : 503,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    } catch (error: any) {
        const responseTime = Date.now() - start;

        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            responseTime,
            error: error.message,
        }, {
            status: 503,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    }
}
