import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import {
  addUserAddress,
  changePassword,
  changeUserProfile,
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
router.route("/me").get(verifyUser, getUserProfile);
router.route("/changepassword").patch(verifyUser, changePassword);
router.route("/me").patch(verifyUser, changeUserProfile);
router.route("/addaddress").post(verifyUser, addUserAddress);

export default router;
