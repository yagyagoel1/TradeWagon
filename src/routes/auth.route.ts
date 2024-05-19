import { Router } from "express";
import {
  logout,
  resendOtp,
  sendToken,
  signin,
  signup,
} from "../controllers/auth.controller";
import { verifyUser } from "../middlewares/auth.middleware";
const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/getAccessToken").get(sendToken);
router.route("/logout").post(verifyUser, logout);
router.route("/verifyOtp").get(verifyUser);
router.route("/resendOtp").get(resendOtp);
export default router;
