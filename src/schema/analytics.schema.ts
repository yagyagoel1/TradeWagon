import { EventType } from "@prisma/client";
import { z } from "zod";



export const analyticsSchema = async (data:{eventType:EventType ,eventId:string}) => {
    const schema  =  z.object({
        eventType: z.nativeEnum(EventType),
        eventId: z.string()
    })
    return schema.safeParse(data)

}

export const getAnalyticsSchema = async (data:{id:string|undefined,page:number}) => {
    const schema = z.object({
        id: z.string().min(10),
        page: z.number(),
    })
    return schema.safeParse(data)
}
