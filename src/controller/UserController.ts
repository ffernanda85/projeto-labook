import { Request, Response } from "express";
import { SignupOutputDTO, SignupSchema } from "../dtos/users/signup.dto";
import { ZodError } from 'zod'
import { BaseError } from "../errors/BaseError";
import { UserDB } from "../models/User";
import { UserBusiness } from "../business/users/UserBusiness";

export class UserController{

    constructor(
        private userBusiness: UserBusiness
    ) {  }

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = SignupSchema.parse({
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            const output: SignupOutputDTO = await this.userBusiness.signup(input)
                
            res.status(201).send(output)
        } catch (error: unknown) {
            console.log(error);
            
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send('unexpected error')
            }
        }
        



    }
}