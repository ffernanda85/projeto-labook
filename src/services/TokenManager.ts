import jwt from 'jsonwebtoken'
import { TokenPayload } from '../models/User'

export class TokenManager{

    createToken = (payload: TokenPayload): string => {
        const token = jwt.sign(
            payload,
            "flavia-fernanda-2024",
            {
                expiresIn: "10d"
            }
        )
        return token
    }
}