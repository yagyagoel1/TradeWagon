import { Router } from "express";
import { addAnalytics } from "../controllers/analytics.controller";



const router = Router();


router.route("/add").get(addAnalytics);
export default router;