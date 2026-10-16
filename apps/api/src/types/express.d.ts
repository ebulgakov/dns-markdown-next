import "express";

declare global {
  namespace Express {
    export interface Request {
      auth?: {
        userId: string;
      };
    }
  }
}
