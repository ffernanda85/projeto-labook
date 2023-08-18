import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { CreatePostInputDTO, CreatePostSchema } from "../dtos/posts/createPost.dto";
import { PostBusiness } from "../business/users/PostBusiness";


export class PostController{

    constructor(
        private postBusiness: PostBusiness
    ){}

    public createPost = async (req: Request, res: Response): Promise<void> => {
        try {

            const input = CreatePostSchema.parse({
                token: req.headers.authorization,
                content: req.body.content
            })

            await this.postBusiness.createPost(input)

            res.status(201).send()
        } catch (error: unknown) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("unexpected error")
            }
        }
    }

    
}