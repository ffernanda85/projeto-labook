import z from 'zod'
import { PostModelOutput } from '../../models/Post'

export interface GetPostsInputDTO {
    token: string
}

export type GetPostsOutputDTO = PostModelOutput[]

export const GetPostSchema = z.object({
    token: z.string().min(1)
}).transform(data => data as GetPostsInputDTO)