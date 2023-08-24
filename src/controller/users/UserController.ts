import { Request, Response } from "express";
import { SignupOutputDTO, SignupSchema } from "../../dtos/users/signup.dto";
import { ZodError } from 'zod'
import { BaseError } from "../../errors/BaseError";
import { UserBusiness } from "../../business/users/UserBusiness";
import { LoginInputDTO, LoginSchema } from "../../dtos/users/login.dto";

export class UserController{

    constructor(
        private userBusiness: UserBusiness
    ) {  }

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = SignupSchema.parse({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            const output: SignupOutputDTO = await this.userBusiness.signup(input)
                
            res.status(201).send(output)
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send('unexpected error')
            }
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            
            const input: LoginInputDTO = LoginSchema.parse({
                email: req.body.email,
                password: req.body.password
            })

            const output = await this.userBusiness.login(input)
            res.status(200).send(output)

        } catch (error: unknown) {
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