import express from 'express'
import { UserController } from '../controller/UserController'
import { UserDatabase } from '../database/UserDatabase'
import { UserBusiness } from '../business/users/UserBusiness'

export const usersRouter = express.Router()
const userController = new UserController(new UserBusiness(new UserDatabase()))

usersRouter.post("/signup", userController.signup)