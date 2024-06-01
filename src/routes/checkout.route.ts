import { Router } from "express";
import { checkout } from "../controllers/checkout.controller";

const router = Router();

router.route("/checkout").post(checkout);

export default router;
