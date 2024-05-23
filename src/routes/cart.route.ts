import { Router } from "express";
import { Roles } from "../constants";
import { verifyUser } from "../middlewares/auth.middleware";
import { getCart } from "../controllers/cart.controller";

const router = Router();

router.route("/").get(verifyUser([Roles.USER, Roles.ADMIN]), getCart);

export default router;
