import { Router } from "express";
import { addAnalytics } from "../controllers/analytics.controller";



const router = Router();


router.route("/add").post(addAnalytics);
export default router;