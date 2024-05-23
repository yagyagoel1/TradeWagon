import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import {
  addProduct,
  deleteProduct,
  getProductId,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { upload } from "../middlewares/multer.middleware";
import { Roles } from "../constants";
const router = Router();

router
  .route("/")
  .get(verifyUser([Roles.USER, Roles.ADMIN]), getProducts)
  .post(verifyUser([Roles.ADMIN]), upload.single("ProductImage"), addProduct);
router
  .route("/:id")
  .get(verifyUser([Roles.USER, Roles.ADMIN]), getProductId)
  .patch(verifyUser([Roles.ADMIN]), updateProduct)
  .delete(verifyUser([Roles.ADMIN]), deleteProduct);

router
  .route("/changeImage/:id")
  .patch(
    verifyUser([Roles.ADMIN]),
    upload.single("ProductImage"),
    updateProduct
  );
export default router;
