import { Router } from "express";
import authRouter from "./auth.route";
import dashboardRouter from "./dashboard.route";
import productRouter from "./product.route";
const router = Router();

router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/products", productRouter);

export default router;
