import { Router } from "express";
import { addAnalytics } from "../controllers/analytics.controller";
import { verifyUser } from "../middlewares/auth.middleware";
import { Roles } from "../constants";



const router = Router();


router.route("/add").post(verifyUser([Roles.USER]),addAnalytics);
router.route("/").get(verifyUser([Roles.ADMIN]),addAnalytics);
export default router;