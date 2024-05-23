import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import {
  addProduct,
  getProductId,
  getProducts,
} from "../controllers/product.controller";
import { upload } from "../middlewares/multer.middleware";
import { Roles } from "../constants";
const router = Router();

router
  .route("/")
  .get(verifyUser, getProducts)
  .post(verifyUser([Roles.ADMIN]), upload.single("ProductImage"), addProduct);

router.route("/:id").get(verifyUser, getProductId);

export default router;
