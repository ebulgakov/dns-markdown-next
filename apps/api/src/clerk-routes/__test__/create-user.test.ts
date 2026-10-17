import { expect, test, describe, mock, beforeEach } from "bun:test";

import type { WebhookEvent } from "@clerk/backend/webhooks";
import type { Mock } from "bun:test";
import type { NextFunction, Request, Response } from "express";

// Mock dependencies
const save = mock(async () => {});
const User = mock(() => ({ save }));

mock.module("@src/db/models/user", () => ({
  User
}));

const verifyMock = mock(() => ({}));
mock.module("svix", () => ({
  Webhook: mock(function () {
    return {
      verify: verifyMock
    };
  })
}));

mock.module("@src/env", () => ({
  env: {
    CLERK_WEBHOOK_SIGNING_SECRET: "test_secret"
  }
}));

// Dynamic import AFTER mocks are set up
const { default: createUserWebhookHandler } = await import("../create-user");

describe("createUserWebhookHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const next: NextFunction = mock(() => {});
  const json = mock(() => res as Response);
  const send = mock(() => res as Response);
  const status = mock(() => res as Response);
  const headerMock = mock(() => undefined as string | undefined);

  beforeEach(() => {
    req = {
      header: headerMock as unknown as Request["header"],
      body: {}
    };
    res = { json, send, status };

    headerMock.mockClear();
    (next as unknown as Mock<NextFunction>).mockClear();
    json.mockClear();
    send.mockClear();
    status.mockClear();
    save.mockClear();
    User.mockClear();
    verifyMock.mockClear();
  });

  test("should return 400 if svix headers are missing", async () => {
    await createUserWebhookHandler(req as Request, res as Response, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith("Error occured -- no svix headers");
  });

  test("should return 400 if webhook verification fails", async () => {
    headerMock
      .mockReturnValueOnce("id")
      .mockReturnValueOnce("timestamp")
      .mockReturnValueOnce("signature");

    const error = new Error("Verification failed");
    verifyMock.mockImplementation(() => {
      throw error;
    });

    await createUserWebhookHandler(req as Request, res as Response, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Verification failed"
    });
  });

  test("should do nothing for non 'user.created' events and return 200", async () => {
    headerMock
      .mockReturnValueOnce("id")
      .mockReturnValueOnce("timestamp")
      .mockReturnValueOnce("signature");

    const event = { type: "user.updated", data: {} };
    verifyMock.mockReturnValue(event);

    req.body = event;

    await createUserWebhookHandler(req as Request, res as Response, next);

    expect(User).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ success: true, message: "Webhook received" });
  });

  test("should create a new user on 'user.created' event", async () => {
    headerMock
      .mockReturnValueOnce("id")
      .mockReturnValueOnce("timestamp")
      .mockReturnValueOnce("signature");

    const event = {
      type: "user.created",
      object: "event",
      data: {
        id: "user_123",
        username: "testuser",
        email_addresses: [{ email_address: "test@example.com" }]
      }
    } as WebhookEvent;
    verifyMock.mockReturnValue(event);

    req.body = event;

    await createUserWebhookHandler(req as Request, res as Response, next);

    expect(User).toHaveBeenCalledWith({
      userId: "user_123",
      username: "testuser",
      email: "test@example.com"
    });
    expect(save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ success: true, message: "Webhook received" });
  });

  test("should call next with error if saving user fails", async () => {
    headerMock
      .mockReturnValueOnce("id")
      .mockReturnValueOnce("timestamp")
      .mockReturnValueOnce("signature");

    const event = {
      type: "user.created",
      object: "event",
      data: {
        id: "user_123",
        username: "testuser",
        email_addresses: [{ email_address: "test@example.com" }]
      }
    } as WebhookEvent;
    verifyMock.mockReturnValue(event);
    const dbError = new Error("DB error");
    save.mockRejectedValueOnce(dbError);

    req.body = event;

    await createUserWebhookHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });
});
