
import { NextRequest, NextResponse } from 'next/server';
import { cache, CacheInvalidator } from '@/libs/cache';

export async function GET() {
    const stats = cache.getStats();
    const keys = cache.getKeys();

    return NextResponse.json({
        stats,
        keys: keys.slice(0, 100), // Limit to first 100 keys
        totalKeys: keys.length,
    });
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pattern = searchParams.get('pattern');
    const tag = searchParams.get('tag');
    const all = searchParams.get('all');

    let invalidated = 0;

    if (all === 'true') {
        cache.clear();
        invalidated = -1; // All cleared
    } else if (pattern) {
        invalidated = cache.invalidatePattern(pattern);
    } else if (tag) {
        invalidated = cache.invalidateByTag(tag);
    } else {
        return NextResponse.json(
            { error: 'Missing invalidation parameter' },
            { status: 400 }
        );
    }

    return NextResponse.json({
        message: 'Cache invalidated successfully',
        invalidated,
        timestamp: new Date().toISOString(),
    });
}

