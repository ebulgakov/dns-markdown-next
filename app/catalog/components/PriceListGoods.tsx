import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { NumericFormat } from "react-number-format";
import type { Goods as GoodsType } from "@/types/pricelist";
import type { GoodDiffChanges as GoodDiffChangesType } from "@/types/diff";

type PriceListGoodsType = {
  item: GoodsType;
  diff?: GoodDiffChangesType;
  status?: {
    deleted?: boolean;
    updatedAt?: string;
  };
};
export default function PriceListGoods({ item, status = {}, diff }: PriceListGoodsType) {
  // Placeholders
  const hideFavorites = false;
  const inFavorites = link => false;
  const removeFromFavorites = (link, id) => {};
  const addToFavorites = (link, id) => {};
  const loadingFavoritesList: string[] = [];

  return (
    <div
      className={cn("pricelist", {
        " -deleted": status.deleted
      })}
    >
      <div className="pricelist_col -photo">
        <Image src={item.image} alt="" width={50} height={50} />
      </div>
      <div className="pricelist_col -info">
        <h4 className="pricelist_title">
          <a target="_blank" rel="noopener noreferrer" href={`http://dns-shop.ru${item.link}`}>
            {item.title}
          </a>
          &nbsp;
          <small>{item.code}</small>
        </h4>
        <p className="pricelist_description">{item.description}</p>
        {item.reasons && (
          <div className="pricelist_reasons">
            {item.reasons.map((reason, idx) => (
              <dl className="pricelist_reason" key={idx}>
                <dt>{reason.label}</dt>
                <dd>{reason.text}</dd>
              </dl>
            ))}
          </div>
        )}
      </div>

      {diff && (
        <div className="pricelist_col -oldPrices">
          <NumericFormat
            value={diff.price}
            displayType="text"
            thousandSeparator=" "
            suffix=" ₽"
            renderText={value => <div className="pricelist_price">{value}</div>}
          />
          <div
            className={cn("pricelist_prices", {
              "-fixHeight": item.priceOld || item.profit
            })}
          >
            <NumericFormat
              value={diff.priceOld}
              displayType="text"
              thousandSeparator=" "
              suffix=" ₽"
              renderText={value => <span className="pricelist_oldPrice">{value}</span>}
            />
            <NumericFormat
              value={diff.profit}
              displayType="text"
              thousandSeparator=" "
              suffix=" ₽"
              renderText={value => <span className="pricelist_profit">{value}</span>}
            />
          </div>
        </div>
      )}
      <div className="pricelist_col -prices">
        <NumericFormat
          value={item.price}
          displayType="text"
          thousandSeparator=" "
          suffix=" ₽"
          renderText={value => <div className="pricelist_price">{value}</div>}
        />
        <div
          className={cn("pricelist_prices", {
            "-fixHeight": diff && (diff.priceOld || diff.profit)
          })}
        >
          <NumericFormat
            value={item.priceOld}
            displayType="text"
            thousandSeparator=" "
            suffix=" ₽"
            renderText={value => <span className="pricelist_oldPrice">{value}</span>}
          />
          <NumericFormat
            value={item.profit}
            displayType="text"
            thousandSeparator=" "
            suffix=" ₽"
            renderText={value => <span className="pricelist_profit">{value}</span>}
          />
        </div>
        {status.updatedAt ? (
          <div className="pricelist_bought">
            Куплен {new Date(status.updatedAt).toLocaleDateString()}
          </div>
        ) : (
          <>
            {item.link && (
              <Link className="pricelist_analysis" href={item.link}>
                Анализ цены
              </Link>
            )}
          </>
        )}
      </div>
      <div className="pricelist_col -address">{item.available}</div>

      {!hideFavorites && (
        <div className="pricelist_col -favorites">
          {inFavorites(item.link) ? (
            <button
              className="pricelist_favorite"
              title="Убрать из избранного"
              disabled={loadingFavoritesList.indexOf(item._id) >= 0}
              onClick={() => {
                removeFromFavorites(item.link, item._id);
              }}
            >
              <Fa icon={faStar} />
            </button>
          ) : (
            <button
              className="pricelist_favorite"
              title="Добавить в избранное"
              disabled={loadingFavoritesList.indexOf(item._id) >= 0}
              onClick={() => {
                addToFavorites(item, item._id);
              }}
            >
              <Fa icon={faStarEmpty} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
