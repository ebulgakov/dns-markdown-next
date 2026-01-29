import resend from "#email/index.ts";
import { FavoriteStatus, User } from "#types/user.ts";

type Goods = {
  priceChanges: [];
  deletedGoods: [];
};

function addStatusInfo(status: FavoriteStatus, link: string) {
  if (!status || !status.updates) return "";

  return status.updates
    .map(update => {
      let myStr = "";
      if (update === "price") {
        myStr += `<p><b>Статус: <a href="https://dns.ebulgakov.com${link}">Изменилась цена товара</a></b></p>`;
      }
      if (update === "availability") {
        if (status.deleted) {
          myStr += `<p><b>Статус: <a href="https://dns.ebulgakov.com${link}">Товар был удалён</a></b></p>`;
        } else {
          myStr += `<p><b>Статус: <a href="https://dns.ebulgakov.com${link}">Товар появился на складе</a></b></p>`;
        }
      }
      return myStr;
    })
    .join("");
}

function addTitle(title: string, link: string) {
  return `<h2><a href="https://www.dns-shop.ru${link}">${title}</a></h2>`;
}

async function sendUpdatesEmail(users: User[]) {
  const emails = [];
  for (const user of users) {
    const { email, notifications, favorites } = user;
    if (!email || !notifications.updates.enabled) continue;

    let body = "Здравствуйте!\n\n У нас есть для вас обновления по вашим избранным товарам.\n\n";
    let count = 0;
    favorites.forEach(favorite => {
      if (favorite.status.updates?.length === 0) return;
      body += `${addTitle(favorite.item.title, favorite.item.link)} произошли следующие изменения: ${addStatusInfo(favorite.status, favorite.item.link)}`;

      if (favorite.status?.updates?.includes("price")) {
        body += `<p>Текущая цена: ${favorite.item.price} руб.</p>`;
        if (favorite.item.priceOld) {
          body += `<p>Старая цена: ${favorite.item.priceOld} руб.</p>`;
        }
        if (favorite.item.profit) {
          body += `<p>Ваша экономия: ${favorite.item.profit} руб.</p>`;
        }
      }

      body += "\n-----------------------\n";

      delete favorite.status.updates; // Clear updates after sending email

      count += 1;
    });

    if (count === 0) continue; // Skip if no updates

    body += `\n\nСпасибо, что пользуетесь сервисом! Отключить уведомления можно в <a href="https://dns.ebulgakov.com/profile#notifications">настройках вашего аккаунта</a> на сайте.`;

    emails.push({
      from: "Днс Уценка Обновления <noreply@dns.ebulgakov.com>",
      to: [email],
      subject: "Обновления по вашим избранным товарам на ДНС Уценка",
      html: body.replace(/\n/g, "<br>")
    });
  }

  await resend.batch.send(emails);

  return users;
}

export { sendUpdatesEmail };
