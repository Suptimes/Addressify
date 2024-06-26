import * as z from "zod"

export const PostValidation = z.object({
    title: z.string().min(5).max(1000),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    price: z.string(),
    description: z.string().min(5).max(2200),
})

export const ProfileValidation = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }).optional(),
    file: z.custom<File[]>().optional(),
    email: z.string().email().optional(),
    // newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }).optional(),
    // oldPassword: z.string().optional(),
    // bio: z.string().optional(),
})