import { Router } from "express";

import { verifyToken } from "../Middleware/ValidateToken.js";

import * as category from "../Controller/CategoryController.js";

const router = Router();

router.post("/add-categories", verifyToken, category.addCategories);

router.get("/get-all-categories", verifyToken, category.getAllCategories);

router.get("/get-all-delivery", verifyToken, category.getAllDelivery);

export default router;
