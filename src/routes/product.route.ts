import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import { getProductId, getProducts } from "../controllers/product.controller";
const router = Router();

router.route("/").get(verifyUser, getProducts);
router.route("/:id").get(verifyUser, getProductId);

export default router;
