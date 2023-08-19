import z from "zod"

export interface EditPostInputDTO {
    id: string,
    token: string,
    content: string
}

export const EditPostSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1),
    content: z.string().min(1)
})