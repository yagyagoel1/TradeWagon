import { Router } from "express";
import {
  logout,
  resendOtp,
  sendToken,
  signin,
  signup,
  verifyOtp,
} from "../controllers/auth.controller";
import { verifyUser } from "../middlewares/auth.middleware";
import { Roles } from "../constants";
const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/getaccesstoken").get(sendToken);
router.route("/logout").post(verifyUser([Roles.ADMIN, Roles.USER]), logout);
router.route("/verifyotp").post(verifyOtp);
router.route("/resendotp").get(resendOtp);
export default router;
