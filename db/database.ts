import "dotenv/config";

import mongoose from "mongoose";

const globalWithMongoose = global as typeof global & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

globalWithMongoose.mongoose = globalWithMongoose.mongoose || {
  conn: null,
  promise: null
};

export async function dbConnect() {
  if (globalWithMongoose.mongoose?.conn) {
    return globalWithMongoose.mongoose.conn;
  }

  const dbUri = process.env.MONGODB_URI!;

  const promise = mongoose.connect(dbUri, {
    autoIndex: true // Auto-indexing for development
  });

  globalWithMongoose.mongoose = {
    conn: await promise,
    promise: promise
  };

  return await promise;
}

export async function dbDisconnect() {
  if (globalWithMongoose.mongoose?.conn) {
    await mongoose.disconnect();
    globalWithMongoose.mongoose.conn = null;
  }
}
