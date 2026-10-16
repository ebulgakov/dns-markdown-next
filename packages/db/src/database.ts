import mongoose from "mongoose";

import type { Mongoose } from "mongoose";

declare global {
  var mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

global.mongoose = global.mongoose || {
  conn: null,
  promise: null
};

export async function dbConnect(dbUri: string) {
  if (global.mongoose && global.mongoose.conn) {
    return global.mongoose.conn;
  }

  const promise = mongoose.connect(dbUri, {
    autoIndex: true // Auto-indexing for development
  });

  global.mongoose = {
    conn: await promise,
    promise: promise
  };

  return await promise;
}

export async function dbDisconnect() {
  if (global.mongoose && global.mongoose.conn) {
    await mongoose.disconnect();
    global.mongoose.conn = null;
  }
}
