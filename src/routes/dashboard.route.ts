import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import {
  getProfileImage,
  getUserProfile,
  putProfilePicture,
} from "../controllers/dashboard.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router
  .route("/updateprofilepicture")
  .patch(verifyUser, upload.single("avatar"), putProfilePicture);
router.route("/getprofilepicture").get(verifyUser, getProfileImage);
router.route("/me").get(getUserProfile);
router.route("/changepassword").patch(verifyUser);
router.route("/me").put(verifyUser);
export default router;
