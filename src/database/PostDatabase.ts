import { PostModel, PostModelDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    TABLE_NAME = "posts"

    public insertPostDB = async (newPostDB: PostModelDB): Promise<void> => {
        await BaseDatabase.connection(this.TABLE_NAME).insert(newPostDB)
    }

    public getAllPosts = async (): Promise<PostModel[]> => {
        const postsDB: PostModel[] = await BaseDatabase.connection(this.TABLE_NAME)
            .select(
                "posts.id",
                "posts.creator_id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.created_at",
                "posts.updated_at",
                "users.id as creatorId",
                "users.name as creatorName"
            )
            .innerJoin("users", "users.id", "posts.creator_id")

        return postsDB
    }
}