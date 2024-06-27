import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { prometheus } from "../middlewares/prometheus.middleware";



const getMetrics = asyncHandler(async (req:Request, res:Response) => {
    res.set("Content-Type", prometheus.register.contentType);
  res.status(200).send(await prometheus.register.metrics());
});
export default getMetrics
