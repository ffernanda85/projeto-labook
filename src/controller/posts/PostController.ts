import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../../errors/BaseError";
import { CreatePostSchema } from "../../dtos/posts/createPost.dto";
import { PostBusiness } from "../../business/posts/PostBusiness";
import { GetPostSchema } from "../../dtos/posts/getPost.dto";
import { EditPostSchema } from "../../dtos/posts/editPost.dto";
import { DeletePostSchema } from "../../dtos/posts/deletePost.dto";
import { LikeDislikePostSchema } from "../../dtos/posts/likeDislikePost.dto";


export class PostController {

    constructor(
        private postBusiness: PostBusiness
    ) { }

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

    public getPosts = async (req: Request, res: Response): Promise<void> => {
        try {

            const input = GetPostSchema.parse({
                token: req.headers.authorization
            })

            const output = await this.postBusiness.getPosts(input)

            res.status(200).send(output)
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

    public editPost = async (req: Request, res: Response): Promise<void> => {
        try {

            const input = EditPostSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
                content: req.body.content
            })

            await this.postBusiness.editPost(input)

            res.status(200).send()

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

    public deletePost = async (req: Request, res: Response): Promise<void> => {
        try {

            const input = DeletePostSchema.parse({
                token: req.headers.authorization,
                id: req.params.id
            })

            await this.postBusiness.deletePost(input)

            res.status(200).send()
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

    public likeDislike = async (req: Request, res: Response): Promise<void> => {
        try {

            const input = LikeDislikePostSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            })

            await this.postBusiness.likeDislike(input)

            res.status(200).send()
            
        } catch (error: unknown) {
            console.log(error);
            
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