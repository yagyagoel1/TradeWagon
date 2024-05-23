import { Router } from "express";
import { Roles } from "../constants";
import { verifyUser } from "../middlewares/auth.middleware";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller";

const router = Router();

router.route("/").get(verifyUser([Roles.USER, Roles.ADMIN]), getCart);
router
  .route("/:productId")
  .post(verifyUser([Roles.USER, Roles.ADMIN]), addToCart)
  .patch(verifyUser([Roles.USER, Roles.ADMIN]), removeFromCart);
export default router;
