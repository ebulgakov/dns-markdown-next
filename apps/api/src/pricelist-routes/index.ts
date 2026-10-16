import { Router } from "express";

import lastPriceListHandler from "./last-pricelist";
import listPriceListsHandler from "./list";
import priceListByIdHandler from "./pricelist-by-id";

const router = Router();

router.get("/", lastPriceListHandler);

router.get("/list", listPriceListsHandler);

router.get("/id/:id", priceListByIdHandler);

export default router;
