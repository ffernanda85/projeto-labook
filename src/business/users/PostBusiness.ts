import { CreatePostInputDTO } from "../../dtos/posts/createPost.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { TokenPayload } from "../../models/User";
import { TokenManager } from "../../services/TokenManager";

export class PostBusiness{

    constructor(
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase
    ){}

    createPost = async (input: CreatePostInputDTO): Promise<void> => {
        const { token, content } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'TOKEN'invalid");
        }

        await this.postDatabase.insertPost()
    }
}