import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import { Roles } from "../constants";
import { ListAllOrdersForAdmin } from "../controllers/orderManagment.controller";

const router = Router();

router.route("/").get(verifyUser([Roles.ADMIN]), ListAllOrdersForAdmin);

export default router;
