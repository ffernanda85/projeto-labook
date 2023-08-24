import { LikeDislikeDBModel } from "../../models/Post";
import { BaseDatabase } from "../BaseDatabase";

export class LikeDislikeDatabase extends BaseDatabase{
    TABLE_NAME = 'likes_dislikes';

    public findLikesDislikes = async (id_post: string, id_user: string): Promise<LikeDislikeDBModel | undefined> => {
        const [likesDislikesDB]: LikeDislikeDBModel[] | undefined = await BaseDatabase.connection(this.TABLE_NAME).where({ post_id: id_post }).andWhere({ user_id: id_user })
        
        return likesDislikesDB
    }

    public createLikesDislikes = async (input: LikeDislikeDBModel): Promise<void> => {
      await BaseDatabase.connection(this.TABLE_NAME).insert(input)
    }

    public deleteLikesDislikes = async (userId: string, postId: string): Promise<void> => {
        await BaseDatabase.connection(this.TABLE_NAME).del().where({ user_id : userId }).andWhere({ post_id : postId })
    }

    public updateLikesDislikes = async ({ like, user_id, post_id }: LikeDislikeDBModel): Promise<void> => {
        await BaseDatabase.connection(this.TABLE_NAME).update({ like }).where({ user_id }).andWhere({ post_id })
    }
}