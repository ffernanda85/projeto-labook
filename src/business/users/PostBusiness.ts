import { PostDatabase } from "../../database/PostDatabase";
import { CreatePostInputDTO } from "../../dtos/posts/createPost.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { Post, PostModelDB } from "../../models/Post";
import { TokenPayload } from "../../models/User";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager } from "../../services/TokenManager";

export class PostBusiness{

    constructor(
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator
    ){}

    public createPost = async (input: CreatePostInputDTO): Promise<void> => {
        const { token, content } = input

        /* verificando token */
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new BadRequestError("'TOKEN'invalid");
        }

        /* Gerando id aleatório */
        const id = this.idGenerator.generate()

        /* criando nova instância de Post */
        const newPost = new Post(
            id,
            payload.id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        )
        const newPostDB: PostModelDB = newPost.postToDBModel()

        await this.postDatabase.insertPostDB(newPostDB)

        /* const output = {
            message: 'created post',
            post: newPost.postToBusinessModel(payload)
        }

        return output */
    }

    public getPosts = async () => {
        
    }
}