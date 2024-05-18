import { Router } from "express";
import { logout, signin, signup } from "../controllers/auth.controller";
import { verifyUser } from "../middlewares/auth.middleware";
const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/logout").post(verifyUser, logout);
export default router;
