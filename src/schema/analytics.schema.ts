import { EventType } from "@prisma/client";
import { z } from "zod";



export const analyticsSchema = async (data:{eventType:EventType ,eventId:string}) => {
    const schema  =  z.object({
        eventType: z.nativeEnum(EventType),
        eventId: z.string()
    })
    return schema.safeParse(data)

}

