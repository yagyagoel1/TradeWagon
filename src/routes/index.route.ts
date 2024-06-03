import { Router } from "express";
import authRouter from "./auth.route";
import dashboardRouter from "./dashboard.route";
import productRouter from "./product.route";
import cartRouter from "./cart.route";
import checkoutRouter from "./checkout.route";
import orderManagmentRouter from "./orderManagment.route";
const router = Router();

router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/orders", checkoutRouter);
router.use("/orderManagment", orderManagmentRouter);
export default router;
