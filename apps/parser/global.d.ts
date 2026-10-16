import type { ChildProcess } from "child_process";

declare global {
  var npmProcess: ChildProcess | null;
}

export {};
