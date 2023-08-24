import { UserDB } from "../../models/User";
import { BaseDatabase } from "../BaseDatabase";

export class UserDatabase extends BaseDatabase{
    TABLE_NAME = "users"

    signup = async (input: UserDB): Promise<void> => {
        await BaseDatabase.connection(this.TABLE_NAME).insert(input)
    }

    findUserByEmail = async (email: string): Promise<UserDB | undefined> => {
        
        const [userDBExist]: UserDB[] | undefined = await BaseDatabase.connection(this.TABLE_NAME).where({ email: email })
        
        return userDBExist
    }

}