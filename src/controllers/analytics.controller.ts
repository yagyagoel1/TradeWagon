import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { analyticsSchema } from "../schema/analytics.schema";
import { ApiError } from "../utils/ApiError";
import { EventType } from "@prisma/client";
import { getOrder } from "./checkout.controller";
import { getOrderById } from "../databaseCalls/order.database";
import { analyticsProductExists, saveAnalyticsData, updateAnalyticsCount } from "../databaseCalls/analytics.database";
import { ApiResponse } from "../utils/ApiResponse";

const addAnalytics  = asyncHandler(async (req:Request, res:Response) => {
    const {eventType,eventId }= req.body;
    const email = req.user?.email
    const validate = await analyticsSchema({eventType,eventId})
    if(!validate.success){
        return res.status(400).json(new ApiError(400,validate.error.errors[0].message))
    }
    if(eventType === EventType.PURCHASE){
        const productIds = await getOrderById(eventId)
        if(!productIds){
            return res.status(404).json(new ApiError(404,"Order not found"))
        }
        for(const product of productIds.items){
            const eventId = product.product.id
            const analyticForProductExists = await analyticsProductExists({eventType,eventId,email})
            if(analyticForProductExists){
                const data = await updateAnalyticsCount(analyticForProductExists.id)
                if(!data){
                    return res.status(500).json(new ApiError(500,"Internal server error"))
                }
            }
            else
            await saveAnalyticsData({eventType,eventId,email})
    }  }
    else{
        const analyticForProductExists = await analyticsProductExists({eventType,eventId,email})
        if(analyticForProductExists){

            const data = await updateAnalyticsCount(analyticForProductExists.id)
            if(!data){
                return res.status(500).json(new ApiError(500,"Internal server error"))
            }
        }
        else
        await saveAnalyticsData({eventType,eventId,email})
    } 
    res.status(200).json(new ApiResponse(200,"Analytics data saved successfully"))
   
});

export {addAnalytics}