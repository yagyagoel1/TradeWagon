import { Router } from "express";
import { checkout, getAllOrders } from "../controllers/checkout.controller";
import { Roles } from "../constants";
import { verifyUser } from "../middlewares/auth.middleware";

const router = Router();

router.route("/checkout").post(verifyUser([Roles.ADMIN, Roles.USER]), checkout);
router
  .route("/orders")
  .get(verifyUser([Roles.ADMIN, Roles.USER]), getAllOrders);

export default router;
