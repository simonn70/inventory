import mongoose from "mongoose"
import "dotenv/config"

const MONGODB_URI = "mongodb+srv://bismarkb609:rzafyY1KjMzMOZg8@cluster0.j1uhnti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

declare global {
    var mongoose: {
      conn: any,
      promise: Promise<any> | null
    };
}

if (!MONGODB_URI) {
    throw new Error("MONGODB URI is missing")
}
  
if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}
let cached = global.mongoose

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn

    cached.conn = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: "laundry",
    })

    cached.conn = await cached.promise
    return cached.conn
}