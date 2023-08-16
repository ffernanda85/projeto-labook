import express from 'express'
import { PostController } from '../controller/PostController'
import { PostBusiness } from '../business/users/PostBusiness'
import { TokenManager } from '../services/TokenManager'
import { PostDatabase } from '../database/PostDatabase'

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new TokenManager(),
        new PostDatabase()
    )
)

postRouter.post("/", postController.createPost)