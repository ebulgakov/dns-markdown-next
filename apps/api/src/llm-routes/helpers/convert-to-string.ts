import type { Goods } from "@dns-markdown/types/pricelist";

export const convertGoodsToString = (goods: Goods) => {
  let str = "";
  const reasonsString = goods.reasons
    ? goods.reasons.map(r => `${r.label}: ${r.text}`).join("; ")
    : "No Defects";

  str += `
  ${goods.title}
  Description: ${goods.description}
  Price: ${goods.price} RUB ${goods.priceOld ? `(Old: ${goods.priceOld} RUB)` : ""}
  Defects: ${reasonsString}
  Link: ${goods.link}
  `;

  return str;
};
