import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import { Roles } from "../constants";
import {
  ListAllOrdersForAdmin,
  updateOrderStatusAdmin,
} from "../controllers/orderManagment.controller";

const router = Router();

router.route("/").get(verifyUser([Roles.ADMIN]), ListAllOrdersForAdmin);

router
  .route("/:orderId")
  .patch(verifyUser([Roles.ADMIN]), updateOrderStatusAdmin);

export default router;
