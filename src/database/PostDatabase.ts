import { PostModelDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase{
    TABLE_NAME = "posts"
    
    public insertPostDB = async (newPostDB: PostModelDB): Promise<void> => {
        await BaseDatabase.connection(this.TABLE_NAME).insert(newPostDB)
    }
    
}