import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO } from "../dtos/posts/createPost.dto";
import { DeletePostInputDTO } from "../dtos/posts/deletePost.dto";
import { EditPostInputDTO } from "../dtos/posts/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post, PostModel, PostModelDB } from "../models/Post";
import { TokenPayload, USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {

    constructor(
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator
    ) { }

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
    }

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
        const { token } = input

        /* validação do token recebido no headers */
        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("invalid token");
        }
        /* Pegando postagens do DB */
        const postsDB = await this.postDatabase.getAllPosts()
        /* Instanciando as postagens e modelando com o método postToBusinessModel criado dentro da class Post */
        const posts: GetPostsOutputDTO = postsDB.map((post) => {
            const result = new Post(
                post.id,
                post.creator_id,
                post.content,
                post.likes,
                post.dislikes,
                post.created_at,
                post.updated_at
            )
            return result.postToBusinessModel(post.creatorId, post.creatorName)
        })
        return posts
    }

    public editPost = async (input: EditPostInputDTO): Promise<void> => {
        const { id, token, content } = input
        
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Invalid TOKEN");
        }
        /* Verificando se a postagem referente ao id enviado existe */
        const postDB = await this.postDatabase.getPostById(id)

        if (!postDB) {
            throw new NotFoundError("ID not found");
        }
        /* Verificando se o token enviado é do criador da postagem */
        if (payload.id !== postDB.creator_id) {
            throw new BadRequestError("You are not creator of the post");
        }

        /* Criando uma nova instância de Post para inserir */
        const postToUpdate = new Post(
            postDB.id,
            postDB.creator_id,
            content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at
        )
        const postToUpdateDB: PostModelDB = postToUpdate.postToDBModel()

        await this.postDatabase.updatePost(postToUpdateDB)
       
    }

    public deletePost = async (input: DeletePostInputDTO): Promise<void> => {
        const { token, id } = input

        /* Verificando de o token é válido */
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("Invalid TOKEN");
        }
        /* verifcando no DB se o ID informado confere com alguma postagem */
        const postDB: PostModelDB = await this.postDatabase.getPostById(id)
        if (!postDB) {
            throw new NotFoundError("ID not found");
        }
        /* verificando se o ID do criador da postagem bate com o do TOKEN informado ou se ele tem uma conta ADMIN*/
        if (postDB.creator_id !== payload.id && payload.role !== USER_ROLES.ADMIN) {
            throw new BadRequestError("Not Authorized!");
        }
        /* enviando o id da postagem como argumento para fazer a deleção no DB */
        await this.postDatabase.deletePostById(id)
    }
}