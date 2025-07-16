import mongoose from "mongoose";

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export const connectMongoose = async () => {
    if (cached.conn) {
        console.log("Using cached Mongoose connection");
        return cached.conn;
    }

    if (!cached.promise) {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("Please define MONGODB_URI in .env.local");
        }

        const opts = {
            bufferCommands: false,
            maxPoolSize: 10, // Giới hạn connection pool
            serverSelectionTimeoutMS: 5000, // Timeout chọn server
            connectTimeoutMS: 10000, // Timeout kết nối
            socketTimeoutMS: 20000, // Timeout socket
        };

        console.log("Creating new Mongoose connection");
        cached.promise = mongoose
            .connect(uri, opts)
            .then((mongoose) => {
                console.log("Connected to MongoDB via Mongoose");
                return mongoose;
            })
            .catch((error) => {
                console.error("Mongoose connection error:", error);
                cached.promise = null; // Reset để thử lại
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};