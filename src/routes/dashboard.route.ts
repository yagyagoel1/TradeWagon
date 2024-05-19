import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import {
  getProfileImage,
  putProfilePicture,
} from "../controllers/dashboard.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router
  .route("/updateprofilepicture")
  .patch(verifyUser, upload.single("avatar"), putProfilePicture);
router.route("/getprofilepicture").get(verifyUser, getProfileImage);
router.route("/me").get(verifyUser);
router.route("/changepassword").patch(verifyUser);
router.route("/me").put(verifyUser);
export default router;
