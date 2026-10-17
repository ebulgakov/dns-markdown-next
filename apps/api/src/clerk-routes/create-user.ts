import { User } from "@src/db/models/user";
import { env } from "@src/env";
import { Webhook } from "svix";

import type { WebhookEvent } from "@clerk/backend/webhooks";
import type { NextFunction, Request, Response } from "express";

async function createUserWebhookHandler(req: Request, res: Response, next: NextFunction) {
  const svix_id = req.header("svix-id");
  const svix_timestamp = req.header("svix-timestamp");
  const svix_signature = req.header("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send("Error occured -- no svix headers");
  }

  const payload = req.body;
  const bodyString = JSON.stringify(payload);

  const wh = new Webhook(env.CLERK_WEBHOOK_SIGNING_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(bodyString, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent;
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err instanceof Error ? err.message : "Unknown error"
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      const { id, email_addresses, username } = evt.data;

      const newUser = new User({
        userId: id,
        username: username || "",
        email: email_addresses[0]?.email_address || "test@exemple.com" // Leave for test in Clerk webhook testing
      });

      await newUser.save();

      res.status(200).json({ success: true, message: "Webhook received" });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(200).json({ success: true, message: "Webhook received" });
  }
}

export default createUserWebhookHandler;
