import { makeGoods, makeUser } from "@dns-markdown/tests/fixtures";
import { resendBatchSend, resetMocks } from "@src/__tests__/setup";
import { beforeEach, describe, expect, test } from "bun:test";

import { sendUpdatesEmail } from "../updates-email";

type SentEmail = { from: string; to: string[]; subject: string; html: string };

const sentEmails = () => (resendBatchSend.mock.calls[0]?.[0] ?? []) as SentEmail[];

const user = (email: string, deleted = false) =>
  makeUser({
    email,
    favorites: [
      {
        _id: `fav-${email}`,
        status: { createdAt: "", updatedAt: "", deleted, city: "samara" },
        item: makeGoods({
          title: "Phone",
          link: "/product/phone/",
          price: "700",
          priceOld: "1000",
          profit: "300"
        })
      }
    ]
  });

describe("sendUpdatesEmail", () => {
  beforeEach(() => {
    resetMocks();
  });

  test("sends a price update with current, old price and profit", async () => {
    const users = [user("a@example.com")];

    const result = await sendUpdatesEmail(users, [{ id: "fav-a@example.com", status: ["price"] }]);

    expect(result).toBe(users);
    const [email] = sentEmails();
    expect(sentEmails()).toHaveLength(1);
    expect(email?.to).toEqual(["a@example.com"]);
    expect(email?.from).toBe("Днс Уценка Обновления <noreply@dns.ebulgakov.com>");
    expect(email?.subject).toBe("Обновления по вашим избранным товарам на ДНС Уценка");
    expect(email?.html).toContain('<a href="https://www.dns-shop.ru/product/phone/">Phone</a>');
    expect(email?.html).toContain("Изменилась цена товара");
    expect(email?.html).toContain("Текущая цена: 700 руб.");
    expect(email?.html).toContain("Старая цена: 1000 руб.");
    expect(email?.html).toContain("Ваша экономия: 300 руб.");
    expect(email?.html).not.toContain("\n");
  });

  test("describes availability changes for removed and returned items", async () => {
    await sendUpdatesEmail(
      [user("removed@example.com", true), user("back@example.com", false)],
      [
        { id: "fav-removed@example.com", status: ["availability"] },
        { id: "fav-back@example.com", status: ["availability"] }
      ]
    );

    const [removed, back] = sentEmails();
    expect(removed?.html).toContain("Товар был удалён");
    expect(back?.html).toContain("Товар появился на складе");
    expect(back?.html).not.toContain("Текущая цена");
  });

  test("skips users without updates", async () => {
    await sendUpdatesEmail(
      [user("none@example.com"), user("empty@example.com"), user("yes@example.com")],
      [
        { id: "fav-empty@example.com", status: [] },
        { id: "fav-yes@example.com", status: ["price"] }
      ]
    );

    expect(sentEmails().map(email => email.to[0])).toEqual(["yes@example.com"]);
  });

  test("does not call Resend when nobody has updates", async () => {
    await sendUpdatesEmail([user("none@example.com")], []);

    expect(resendBatchSend).not.toHaveBeenCalled();
  });

  test("splits sends into batches of 100", async () => {
    const emails = Array.from({ length: 150 }, (_, i) => `u${i}@example.com`);

    await sendUpdatesEmail(
      emails.map(email => user(email)),
      emails.map(email => ({ id: `fav-${email}`, status: ["price"] }))
    );

    expect(resendBatchSend.mock.calls.map(([batch]) => batch.length)).toEqual([100, 50]);
  });

  test("throws when Resend returns an error", async () => {
    resendBatchSend.mockImplementation(async () => ({
      data: null,
      error: { message: "Invalid key" }
    }));

    await expect(
      sendUpdatesEmail([user("a@example.com")], [{ id: "fav-a@example.com", status: ["price"] }])
    ).rejects.toThrow("Failed to send update emails: Invalid key");
  });
});
