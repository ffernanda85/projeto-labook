import { UserDatabase } from "../../database/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../../dtos/users/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../../dtos/users/signup.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { TokenPayload, USER_ROLES, User, UserDB } from "../../models/User";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager } from "../../services/TokenManager";

export class UserBusiness{
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }
    
    signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        
        const { name, email, password } = input
        const id = this.idGenerator.generate()

        const newUser = new User(
            id,
            name,
            email,
            password,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        ) 
        const newUserDB: UserDB = newUser.toDBModel()
        await this.userDatabase.signup(newUserDB)

        const payload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }
        const token = this.tokenManager.createToken(payload)
        const output: SignupOutputDTO = {
            token
        }
        return output
    }

    login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        
        const { email, password } = input

        const userDBExist: UserDB | undefined = await this.userDatabase.findUserByEmail(email)
        if (!userDBExist) {
            throw new NotFoundError("Email not registered");
        }

        if (password !== userDBExist.password) {
            throw new BadRequestError("password does not match");
        }

        const output: LoginOutputDTO = {
            token: "token"
        }

        return output
    }
}