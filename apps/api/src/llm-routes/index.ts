import { Router } from "express";

import compareProductsHandler from "./compare-products";
import describeProductHandler from "./describe-product";

const router = Router();

router.get("/compare-products", compareProductsHandler);
router.get("/describe-product", describeProductHandler);

export default router;
