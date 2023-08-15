import { UserDatabase } from "../../database/UserDatabase";
import { SignupInputDTO, SignupOutputDTO } from "../../dtos/users/signup.dto";
import { USER_ROLES, UserDB } from "../../models/User";
import { IdGenerator } from "../../services/IdGenerator";

export class UserBusiness{
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator
    ) { }
    
    signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        
        const { name, email, password } = input
        const id = this.idGenerator.generate()

        const newUserDB: UserDB = {
            id,
            name,
            email,
            password,
            role: USER_ROLES.NORMAL,
            created_at: new Date().toISOString()
        }
        await this.userDatabase.signup(newUserDB)

        const output: SignupOutputDTO = {
            token: 'created token'
        }

        return output
    }
}