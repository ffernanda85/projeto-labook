import express from 'express'
import { PostController } from '../controller/posts/PostController'
import { PostBusiness } from '../business/posts/PostBusiness'
import { TokenManager } from '../services/TokenManager'
import { PostDatabase } from '../database/posts/PostDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { LikeDislikeDatabase } from '../database/posts/LikeDislikeDatabase'

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new TokenManager(),
        new PostDatabase(),
        new IdGenerator(),
        new LikeDislikeDatabase()
    )
)

postRouter.post("/", postController.createPost)
postRouter.get("/", postController.getPosts)
postRouter.put("/:id", postController.editPost)
postRouter.delete("/:id", postController.deletePost)
postRouter.put("/:id/like", postController.likeDislike)