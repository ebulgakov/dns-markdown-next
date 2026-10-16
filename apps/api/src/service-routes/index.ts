import { Router } from "express";

import addAnalysisReportHandler from "./add-analysis-report";
import addNewPriceListHandler from "./add-new-price-list";
import allNotificationUsersHandler from "./all-notification-users";
import allPriceListsHandler from "./all-price-lists";
import clearCacheByKeyHandler from "./clear-cache-by-key";
import deleteAnalysisDataHandler from "./delete-analysis-data";
import deleteAnalysisDataByDateHandler from "./delete-analysis-data-by-date";
import deleteAnalysisDiffHandler from "./delete-analysis-diff";
import deleteAnalysisDiffByDateHandler from "./delete-analysis-diff-by-date";
import deleteAnalysisReportByCityDateHandler from "./delete-analysis-report-by-city-date";
import deleteLastPriceListHandler from "./delete-last-price-list";
import deleteOldPriceListsHandler from "./delete-old-price-lists";
import insertAnalysisDataHandler from "./insert-analysis-data";
import insertAnalysisDiffHandler from "./insert-analysis-diff";
import updateUsersFavoritesHandler from "./update-users-favorites";

const router = Router();

router.get("/all-price-lists", allPriceListsHandler);
router.post("/delete-last-price-list", deleteLastPriceListHandler);
router.post("/delete-old-price-lists", deleteOldPriceListsHandler);
router.post("/add-new-price-list", addNewPriceListHandler);

router.post("/insert-analysis-data", insertAnalysisDataHandler);
router.post("/delete-analysis-data", deleteAnalysisDataHandler);
router.post("/delete-analysis-data-by-date", deleteAnalysisDataByDateHandler);

router.post("/insert-analysis-diff", insertAnalysisDiffHandler);
router.post("/delete-analysis-diff", deleteAnalysisDiffHandler);
router.post("/delete-analysis-diff-by-date", deleteAnalysisDiffByDateHandler);

router.post("/add-analysis-report", addAnalysisReportHandler);
router.post("/delete-analysis-report-by-city-date", deleteAnalysisReportByCityDateHandler);

router.get("/all-notification-users", allNotificationUsersHandler);
router.post("/update-users-favorites", updateUsersFavoritesHandler);

router.post("/clear-cache-by-key", clearCacheByKeyHandler);

export default router;
