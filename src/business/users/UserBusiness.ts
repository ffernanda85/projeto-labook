import { UserDatabase } from "../../database/UserDatabase";
import { SignupInputDTO, SignupOutputDTO } from "../../dtos/users/signup.dto";
import { USER_ROLES, UserDB } from "../../models/User";

export class UserBusiness{
    constructor(
        private userDatabase: UserDatabase
    ) { }
    
    signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        
        const { id, name, email, password } = input

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
            message: 'created user',
            token: 'created token'
        }

        return output
    }
}