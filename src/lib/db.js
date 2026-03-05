// import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   throw new Error("Please define MONGO_URI in .env.local");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export const connectDB = async () => {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(MONGO_URI, {
//         dbName: "myshop",
//       })
//       .then((mongoose) => mongoose)
//       .catch((error) => {
//         console.error("MongoDB connection error:", error);
//         throw new Error("Database connection failed: " + (error.message || error));
//       });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// };


// lib/db.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI in .env.local");
}

// Global cached connection to prevent multiple connections in dev mode
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: "myshop", // optional, can be inferred from URI
      })
      .then((mongoose) => {
        console.log("MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw new Error("Database connection failed: " + (err.message || err));
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}