import { MongoClient, Db, MongoClientOptions } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Tối ưu connection options cho App Router
const mongoClientOptions: MongoClientOptions = {
    maxPoolSize: 8,
    minPoolSize: 2,
    connectTimeoutMS: 8000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 15000,
    compressors: ['zlib'],
    maxIdleTimeMS: 45000,
    retryWrites: true,
    retryReads: true,
    readPreference: 'primary',
};

const mongooseOptions = {
    bufferCommands: false,
    maxPoolSize: 8,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 8000,
    socketTimeoutMS: 15000,
    autoIndex: process.env.NODE_ENV !== 'production',
    autoCreate: process.env.NODE_ENV !== 'production',
};

interface GlobalMongo {
    client?: MongoClient;
    promise?: Promise<MongoClient>;
    mongoose?: typeof mongoose;
    mongoosePromise?: Promise<typeof mongoose>;
}

declare global {
    var __mongo: GlobalMongo | undefined;
}

let cached = global.__mongo || {
    client: undefined,
    promise: undefined,
    mongoose: undefined,
    mongoosePromise: undefined,
};

if (!global.__mongo) {
    global.__mongo = cached;
}

// MongoDB Native Client Connection
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
    if (cached.client) {
        try {
            await cached.client.db().admin().ping();
            return {
                client: cached.client,
                db: cached.client.db(),
            };
        } catch (error) {
            console.warn('Cached MongoDB client is disconnected, reconnecting...');
            cached.client = undefined;
            cached.promise = undefined;
        }
    }

    if (!cached.promise) {
        console.log('Creating new MongoDB native connection...');
        cached.promise = MongoClient.connect(uri!, mongoClientOptions);
    }

    try {
        cached.client = await cached.promise;
        await cached.client.db().admin().ping();
        console.log('✅ MongoDB native client connected');
        return {
            client: cached.client,
            db: cached.client.db(),
        };
    } catch (error) {
        console.error('❌ MongoDB native connection failed:', error);
        cached.promise = undefined;
        cached.client = undefined;
        throw error;
    }
}

// Mongoose Connection for ODM
export async function connectMongoose(): Promise<typeof mongoose> {
    if (cached.mongoose?.connection?.readyState === 1) {
        return cached.mongoose;
    }

    if (!cached.mongoosePromise) {
        console.log('Creating new Mongoose connection...');
        cached.mongoosePromise = mongoose.connect(uri!, mongooseOptions);
    }

    try {
        cached.mongoose = await cached.mongoosePromise;
        console.log('✅ Mongoose connected');
        return cached.mongoose;
    } catch (error) {
        console.error('❌ Mongoose connection failed:', error);
        cached.mongoosePromise = undefined;
        cached.mongoose = undefined;
        throw error;
    }
}

// Unified connection function - cho App Router
export async function dbConnect(): Promise<Db> {
    try {
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Database connection timeout')), 10000);
        });

        const connectionPromise = (async () => {
            await connectMongoose();
            const { db } = await connectToDatabase();
            return db;
        })();

        const db = await Promise.race([connectionPromise, timeoutPromise]);
        return db;
    } catch (error) {
        console.error('❌ dbConnect error:', error);
        throw error;
    }
}

// Connection health check
export async function checkDatabaseHealth(): Promise<{
    mongodb: boolean;
    mongoose: boolean;
    latency: number;
}> {
    const start = Date.now();

    try {
        const [mongoResult, mongooseResult] = await Promise.allSettled([
            (async () => {
                const { client } = await connectToDatabase();
                await client.db().admin().ping();
                return true;
            })(),
            (async () => {
                const mongoose = await connectMongoose();
                return mongoose.connection.readyState === 1;
            })(),
        ]);

        const latency = Date.now() - start;

        return {
            mongodb: mongoResult.status === 'fulfilled' && mongoResult.value,
            mongoose: mongooseResult.status === 'fulfilled' && mongooseResult.value,
            latency,
        };
    } catch (error) {
        console.error('Health check failed:', error);
        return {
            mongodb: false,
            mongoose: false,
            latency: Date.now() - start,
        };
    }
}

// Graceful shutdown
export async function closeDatabaseConnections(): Promise<void> {
    try {
        const promises: Promise<void>[] = [];

        if (cached.client) {
            promises.push(cached.client.close());
        }

        if (cached.mongoose) {
            promises.push(cached.mongoose.connection.close());
        }

        await Promise.all(promises);

        cached.client = undefined;
        cached.promise = undefined;
        cached.mongoose = undefined;
        cached.mongoosePromise = undefined;

        console.log('✅ Database connections closed gracefully');
    } catch (error) {
        console.error('❌ Error closing database connections:', error);
    }
}

if (process.env.NODE_ENV !== "test" && !(global as any).__db_listeners_added) {
    process.on("SIGINT", closeDatabaseConnections);
    process.on("SIGTERM", closeDatabaseConnections);
    process.on("beforeExit", closeDatabaseConnections);

    (global as any).__db_listeners_added = true;
}
