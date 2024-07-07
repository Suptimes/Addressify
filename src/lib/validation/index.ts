import * as z from "zod"

export const PostValidation = z.object({
    title: z.string().min(5).max(1000),
    files: z.array(z.instanceof(File)).optional(), // Optional array of files
    location: z.string().min(2).max(100),
    price: z.string().min(1),
    description: z.string().min(5).max(2200),
    type: z.string(),
    property: z.string(),
    beds: z.string().min(0),
    baths: z.string().min(0).max(15),
    duration: z.string(),
    cheques: z.string().min(1),
    city: z.string().min(1),
    address: z.string().min(1).optional(),
    size: z.string().min(1),
    category: z.string(),
    isUpdate: z.boolean().optional(), // Flag to indicate if it's an update
}).refine(data => data.files?.length > 0 || data.isUpdate, {
    message: "At least one image is required",
    path: ["files"]
});


export const ProfileValidation = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }).optional(),
    file: z.custom<File[]>().optional(),
    email: z.string().email().optional(),
    // newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }).optional(),
    // oldPassword: z.string().optional(),
    // bio: z.string().optional(),
})