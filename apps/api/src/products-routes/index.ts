import { Router } from "express";

import mostCheapProductsHandler from "./most-cheap-products";
import mostDiscountedProductsHandler from "./most-discounted-products";
import mostProfitableProductsHandler from "./most-profitable-products";
import productByLinkHandler from "./product-by-link";

const router = Router();

router.get("/link", productByLinkHandler);
router.get("/most-cheap-products", mostCheapProductsHandler);
router.get("/most-discounted-products", mostDiscountedProductsHandler);

router.get("/most-profitable-products", mostProfitableProductsHandler);

export default router;
