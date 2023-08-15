import express from 'express'
import { UserController } from '../controller/UserController'
import { UserDatabase } from '../database/UserDatabase'
import { UserBusiness } from '../business/users/UserBusiness'
import { IdGenerator } from '../services/IdGenerator'

export const usersRouter = express.Router()
const userController = new UserController(new UserBusiness(new UserDatabase(), new IdGenerator()))

usersRouter.post("/signup", userController.signup)
