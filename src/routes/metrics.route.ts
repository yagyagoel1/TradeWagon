import express from "express";
import getMetrics from "../controllers/metrics.controller";

const router = express.Router();

router.route("/").get(getMetrics);


export default router;
