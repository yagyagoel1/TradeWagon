import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import {
  addUserAddress,
  changePassword,
  changeUserProfile,
  getProfileImage,
  getUserProfile,
  putProfilePicture,
  removeUserAddress,
  updateUserAddress,
} from "../controllers/dashboard.controller";
import { upload } from "../middlewares/multer.middleware";
import { Roles } from "../constants";

const router = Router();

router
  .route("/updateprofilepicture")
  .patch(verifyUser, upload.single("avatar"), putProfilePicture);
router
  .route("/getprofilepicture")
  .get(verifyUser([Roles.ADMIN, Roles.USER]), getProfileImage);
router.route("/me").get(verifyUser([Roles.ADMIN, Roles.USER]), getUserProfile);
router
  .route("/changepassword")
  .patch(verifyUser([Roles.ADMIN, Roles.USER]), changePassword);
router
  .route("/me")
  .patch(verifyUser([Roles.ADMIN, Roles.USER]), changeUserProfile);
router
  .route("/addaddress")
  .post(verifyUser([Roles.ADMIN, Roles.USER]), addUserAddress);
router
  .route("/removeaddress")
  .delete(verifyUser([Roles.ADMIN, Roles.USER]), removeUserAddress);
router
  .route("/updateaddress")
  .patch(verifyUser([Roles.ADMIN, Roles.USER]), updateUserAddress);
export default router;
