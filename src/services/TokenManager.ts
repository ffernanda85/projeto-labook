import jwt from 'jsonwebtoken'
import { TokenPayload } from '../models/User'
import dotenv from 'dotenv'

dotenv.config()

export class TokenManager{

    createToken = (payload: TokenPayload): string => {
        const token = jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )
        return token
    }
}