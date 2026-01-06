import type { Mongoose } from "mongoose";
import { AbortController } from "node/web-globals/abortcontroller.js";
import { ChildProcess } from "child_process";

declare global {
  var mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;

  var npmProcess: ChildProcess | null;
}

export {};
