import resend from "./index";

import type { Favorite, User } from "@dns-markdown/db/types/user";

export type FavoriteUpdatesStatus = "availability" | "price";

export type FavoriteStatus = {
  id: string;
  status: FavoriteUpdatesStatus[];
};

function addStatusInfo(statuses: FavoriteUpdatesStatus[], favorite: Favorite) {
  if (!statuses) return "";

  return statuses
    .map(update => {
      let myStr = "";
      if (update === "price") {
        myStr += `<p><b>Статус: <a href="https://dns.ebulgakov.com${favorite.item.link}">Изменилась цена товара</a></b></p>`;
      }
      if (update === "availability") {
        if (favorite.status.deleted) {
          myStr += `<p><b>Статус: <a href="https://dns.ebulgakov.com${favorite.item.link}">Товар был удалён</a></b></p>`;
        } else {
          myStr += `<p><b>Статус: <a href="https://dns.ebulgakov.com${favorite.item.link}">Товар появился на складе</a></b></p>`;
        }
      }
      return myStr;
    })
    .join("");
}

function addTitle(title: string, link: string) {
  return `<h2><a href="https://www.dns-shop.ru${link}">${title}</a></h2>`;
}

async function sendUpdatesEmail(users: User[], statuses: FavoriteStatus[]) {
  const emails = [];
  for (const user of users) {
    const { email, favorites } = user;

    let body = "Здравствуйте!\n\n У нас есть для вас обновления по вашим избранным товарам.\n\n";
    let count = 0;
    favorites.forEach(favorite => {
      const favoriteStatus = statuses.find(status => status.id === favorite._id);
      if (!favoriteStatus || favoriteStatus.status.length === 0) return;

      body += `${addTitle(favorite.item.title, favorite.item.link)} произошли следующие изменения: ${addStatusInfo(favoriteStatus.status, favorite)}`;

      if (favoriteStatus.status.includes("price")) {
        body += `<p>Текущая цена: ${favorite.item.price} руб.</p>`;
        if (favorite.item.priceOld) {
          body += `<p>Старая цена: ${favorite.item.priceOld} руб.</p>`;
        }
        if (favorite.item.profit) {
          body += `<p>Ваша экономия: ${favorite.item.profit} руб.</p>`;
        }
      }

      body += "\n-----------------------\n";

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
