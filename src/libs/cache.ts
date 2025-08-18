
interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number;
    tags?: string[];
}

interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    hitRate: number;
}

class SimpleCache {
    private cache = new Map<string, CacheItem<any>>();
    private stats = { hits: 0, misses: 0 };
    private maxSize = 1000;

    set<T>(key: string, data: T, ttlSeconds: number = 300, tags: string[] = []): void {
        if (this.cache.size >= this.maxSize) {
            this.cleanup();
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlSeconds * 1000,
            tags,
        });
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) {
            this.stats.misses++;
            return null;
        }

        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return item.data;
    }

    invalidatePattern(pattern: string): number {
        let count = 0;
        for (const [key] of this.cache) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
                count++;
            }
        }
        return count;
    }

    invalidateByTag(tag: string): number {
        let count = 0;
        for (const [key, item] of this.cache) {
            if (item.tags?.includes(tag)) {
                this.cache.delete(key);
                count++;
            }
        }
        return count;
    }

    async getOrSet<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttlSeconds: number = 300,
        tags: string[] = []
    ): Promise<T> {
        const cached = this.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        const data = await fetcher();
        this.set(key, data, ttlSeconds, tags);
        return data;
    }

    cleanup(): number {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, item] of this.cache) {
            if (now - item.timestamp > item.ttl) {
                this.cache.delete(key);
                cleaned++;
            }
        }

        return cleaned;
    }

    getStats(): CacheStats {
        const total = this.stats.hits + this.stats.misses;
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            size: this.cache.size,
            hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
        };
    }

    clear(): void {
        this.cache.clear();
    }

    getKeys(): string[] {
        return Array.from(this.cache.keys());
    }

    has(key: string): boolean {
        return this.cache.has(key) && this.get(key) !== null;
    }

    size(): number {
        return this.cache.size;
    }
}

export const cache = new SimpleCache();

export const CacheKeys = {
    TODOS: 'todos',
    CATEGORIES: 'categories',
    USER: 'user',

    todosList: (filters: Record<string, any>) => `todos:list:${JSON.stringify(filters)}`,
    todoDetail: (id: string) => `todos:detail:${id}`,
    categoriesList: () => 'categories:list',
    userProfile: (userId: string) => `user:profile:${userId}`,
} as const;

export function Cacheable(
    key: string | ((...args: any[]) => string),
    ttl: number = 300,
    tags: string[] = []
) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const cacheKey = typeof key === 'function' ? key(...args) : key;
            return cache.getOrSet(
                cacheKey,
                () => originalMethod.apply(this, args),
                ttl,
                tags
            );
        };

        return descriptor;
    };
}

export class CacheInvalidator {
    static invalidateTodos(): number {
        return cache.invalidatePattern('todos:');
    }

    static invalidateCategories(): number {
        return cache.invalidatePattern('categories:');
    }

    static invalidateUser(userId?: string): number {
        return userId
            ? cache.invalidatePattern(`user:${userId}`)
            : cache.invalidatePattern('user:');
    }

    static invalidateByTags(tags: string[]): number {
        let total = 0;
        tags.forEach((tag) => {
            total += cache.invalidateByTag(tag);
        });
        return total;
    }

    static invalidateAll(): void {
        cache.clear();
    }
}

if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const cleaned = cache.cleanup();
        if (cleaned > 0 && process.env.NODE_ENV === 'development') {
            console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries`);
        }
    }, 5 * 60 * 1000);
}