import { Router } from "express";

import createUserWebhookHandler from "./create-user";

const router = Router();

router.post("/create-user", createUserWebhookHandler);

export default router;
