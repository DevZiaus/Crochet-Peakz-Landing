import { createHash } from 'node:crypto';

const WINDOW_SECONDS = 30 * 60;
const WINDOW_MS = WINDOW_SECONDS * 1000;

type MemoryStore = Map<string, number>;

const globalForRateLimit = globalThis as typeof globalThis & {
    __contactFormRateLimit?: MemoryStore;
};

const memoryStore =
    (globalForRateLimit.__contactFormRateLimit ??= new Map<string, number>());

export type RateLimitResult =
    | { allowed: true }
    | { allowed: false; retryAfterSeconds: number };

type RedisConfig = {
    url: string;
    token: string;
};

type RedisCommandResult = {
    result?: unknown;
    error?: string;
};

function getRedisConfig(): RedisConfig | null {
    const url =
        process.env.UPSTASH_REDIS_REST_URL ??
        process.env.KV_REST_API_URL;
    const token =
        process.env.UPSTASH_REDIS_REST_TOKEN ??
        process.env.KV_REST_API_TOKEN;

    if (!url || !token) return null;

    return { url: url.replace(/\/+$/, ''), token };
}

function rateLimitKey(ip: string) {
    const hashedIp = createHash('sha256').update(ip).digest('hex');
    return `crochet-peakz:contact-form:${hashedIp}`;
}

function checkMemory(key: string): RateLimitResult {
    const now = Date.now();
    const expiresAt = memoryStore.get(key);

    if (expiresAt && expiresAt > now) {
        return {
            allowed: false,
            retryAfterSeconds: Math.max(
                1,
                Math.ceil((expiresAt - now) / 1000),
            ),
        };
    }

    memoryStore.set(key, now + WINDOW_MS);

    if (memoryStore.size > 5000) {
        memoryStore.forEach((storedExpiry, storedKey) => {
            if (storedExpiry <= now) memoryStore.delete(storedKey);
        });
    }

    return { allowed: true };
}

async function checkRedis(
    key: string,
    config: RedisConfig,
): Promise<RateLimitResult> {
    const response = await fetch(`${config.url}/pipeline`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([
            ['SET', key, '1', 'NX', 'EX', String(WINDOW_SECONDS)],
            ['TTL', key],
        ]),
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
        throw new Error(`Rate limit store responded with ${response.status}.`);
    }

    const data = (await response.json()) as RedisCommandResult[];

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Rate limit store returned an unexpected response.');
    }

    const setResult = data[0];
    const ttlResult = data[1];

    if (setResult?.error) {
        throw new Error(setResult.error);
    }

    if (setResult?.result === 'OK') {
        return { allowed: true };
    }

    const ttl = Number(ttlResult?.result);

    return {
        allowed: false,
        retryAfterSeconds:
            Number.isFinite(ttl) && ttl > 0 ? ttl : WINDOW_SECONDS,
    };
}

export async function checkContactRateLimit(
    ip: string,
): Promise<RateLimitResult> {
    const key = rateLimitKey(ip);
    const redis = getRedisConfig();

    if (redis) {
        try {
            return await checkRedis(key, redis);
        } catch (error) {
            console.error(
                '[contact] Distributed rate limit unavailable; using in-memory fallback.',
                error,
            );
        }
    }

    return checkMemory(key);
}

export async function clearContactRateLimit(ip: string): Promise<void> {
    const key = rateLimitKey(ip);

    memoryStore.delete(key);

    const redis = getRedisConfig();
    if (!redis) return;

    try {
        const response = await fetch(`${redis.url}/pipeline`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${redis.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([['DEL', key]]),
            cache: 'no-store',
            signal: AbortSignal.timeout(3000),
        });

        if (!response.ok) {
            throw new Error(
                `Rate limit store responded with ${response.status}.`,
            );
        }
    } catch (error) {
        console.error(
            '[contact] Could not clear the rate limit after a send failure.',
            error,
        );
    }
}

export function getClientIp(headers: Headers): string {
    const forwardedFor = headers.get('x-forwarded-for');

    if (forwardedFor) {
        const firstAddress = forwardedFor.split(',')[0]?.trim();
        if (firstAddress) return firstAddress;
    }

    return (
        headers.get('x-real-ip')?.trim() ||
        headers.get('cf-connecting-ip')?.trim() ||
        'unknown'
    );
}
