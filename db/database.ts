import mongoose from "mongoose";

global.mongoose = global.mongoose || {
  conn: null,
  promise: null
};

export async function dbConnect() {
  if (global.mongoose && global.mongoose.conn) {
    return global.mongoose.conn;
  }

  const dbUri = process.env.MONGODB_URI!;

  const promise = mongoose.connect(dbUri, {
    autoIndex: true // Auto-indexing for development
  });

  global.mongoose = {
    conn: await promise,
    promise: promise
  };

  return await promise;
}
