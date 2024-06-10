import { EventType } from "@prisma/client"
import { prisma } from "../db"

export const saveAnalyticsData = async(data:{eventType:EventType ,eventId:string,email:string }) => {
    return await prisma.analytics.create({
    
        data:{
            eventType:data.eventType,
            productId:data.eventId,
            userEmail:data.email
        }
        
    })
}
export const updateAnalyticsCount = async(
    analyticsId:string
    
)=>{
    return await prisma.analytics.update({
        where:{
            id:analyticsId
        },
        data:{
            count:{
                increment:1
            }
        }
    })
}
export const analyticsProductExists = async(data:{eventType:EventType ,eventId:string,email:string })=>{
    return await prisma.analytics.findFirst({
    where:{
        eventType:data.eventType,
        productId:data.eventId,
        userEmail:data.email
    },
    select:{
        id:true
    }
    })
}
export const getAnalyticsData = async(userId:string,page:number)=>{
    return await prisma.analytics.findMany({
        where:{
            userEmail:userId,
        },
        take:10,
        skip:(page-1)*10
    })
}