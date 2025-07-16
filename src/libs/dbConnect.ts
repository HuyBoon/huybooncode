import { connectMongoose } from "./mongoose";
import clientPromise from "./mongoConnect";
import type { Db } from "mongodb";

export async function dbConnect(): Promise<Db> {
  try {
    await connectMongoose();
    const client = await clientPromise;
    console.log("MongoDB Db instance ready");
    return client.db();
  } catch (error) {
    console.error("dbConnect error:", error);
    throw error;
  }
}