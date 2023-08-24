import { UserDatabase } from "../../database/users/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../../dtos/users/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../../dtos/users/signup.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { TokenPayload, USER_ROLES, User, UserDB } from "../../models/User";
import { HashManager } from "../../services/HashManager";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager } from "../../services/TokenManager";

export class UserBusiness{
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }
    
    signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        
        const { name, email, password } = input
        /* Verificando se já existe esse email no DB */
        const emailExistsDB = await this.userDatabase.findUserByEmail(email)
        /* Se email constar no DB dispara uma BadRequest */
        if (emailExistsDB) {
            throw new BadRequestError("'EMAIL' already resgistered");
        }
        /* Gerando ID aleatório */
        const id = this.idGenerator.generate()
        /* Hasheando password */
        const hashedPassword = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            name,
            email,
            hashedPassword,
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
        const plainText = userDBExist.password
        const isPasswordsMatch = await this.hashManager.compare(password, plainText)

        if (!isPasswordsMatch) {
            throw new BadRequestError("password does not match");
        }
        const user = new User(
            userDBExist.id,
            userDBExist.name,
            userDBExist.email,
            userDBExist.password,
            userDBExist.role,
            userDBExist.created_at
        )
        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }
        const token = this.tokenManager.createToken(payload)
        const output: LoginOutputDTO = {
            token
        }
        return output
    }
}