import * as z from "zod"

export const PostValidation = z.object({
    title: z.string().min(5).max(1000),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    price: z.string(),
    description: z.string().min(5).max(2200),
})