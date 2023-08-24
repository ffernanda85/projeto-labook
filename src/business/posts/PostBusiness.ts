import { LikeDislikeDatabase } from "../../database/posts/LikeDislikeDatabase";
import { PostDatabase } from "../../database/posts/PostDatabase";
import { CreatePostInputDTO } from "../../dtos/posts/createPost.dto";
import { DeletePostInputDTO } from "../../dtos/posts/deletePost.dto";
import { EditPostInputDTO } from "../../dtos/posts/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../../dtos/posts/getPost.dto";
import { LikeDislikePostInputDTO } from "../../dtos/posts/likeDislikePost.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { LikeDislikeDBModel, Post, PostModelDB } from "../../models/Post";
import { TokenPayload, USER_ROLES } from "../../models/User";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager } from "../../services/TokenManager";

export class PostBusiness {

    constructor(
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private likeDislikeDatabase: LikeDislikeDatabase
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

    public likeDislike = async (input: LikeDislikePostInputDTO) => {
        const { id: postId, token, like } = input
        /* Verificando se o token é válido */
        const payload: TokenPayload | null = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("invalid TOKEN");
        }
        /* Verificando se o post com o ID informado existe no DB */
        const postDB: PostModelDB | undefined = await this.postDatabase.getPostById(postId)
        if (!postDB) {
            throw new NotFoundError("ID not found");
        }
        /* Verificando se o usuário é o criador da postagem */
        const { creator_id } = postDB
        const { id: user_id } = payload
        if (creator_id === user_id) {
            throw new BadRequestError("creator can't like or dislike the post");
        }
        
        /* Transformando o like em inteiro para passar para o DB */
        const likePost: number = Number(like)

        /* Criando o obj de likes_dislikes */
        const like_dislike: LikeDislikeDBModel = {
            user_id,
            post_id: postId,
            like: likePost
        }

        /* Verificar se existe registro em likes_dislikes (id_post + id_user) */
        const likesDislikesExists: LikeDislikeDBModel | undefined = await this.likeDislikeDatabase.findLikesDislikes(postId, payload.id)

        /* Se não houver registro em likes_dislikes inserir na tabela */
        if (!likesDislikesExists) {
            await this.likeDislikeDatabase.createLikesDislikes(like_dislike)
            /* se like for 1 incrementamos o likes, senão incrementamos o dislikes na posts */
            likePost === 1 ?
                await this.postDatabase.incrementLike(postId) :
                await this.postDatabase.incrementDislike(postId)

            /* Se houver registro */
        } else {
            //1) verificamos se o like enviado é o mesmo existente
            if (likesDislikesExists.like === likePost) {
                //nesse caso deletamos o registro existente
                await this.likeDislikeDatabase.deleteLikesDislikes(user_id, postId)

                likePost === 1 ?
                    await this.postDatabase.decrementLike(postId) : await this.postDatabase.decrementDislike(postId)
            } else {
                //se o like enviado não for igual ao existente no registro, vamos precisar editar nosso registro no DB
                await this.likeDislikeDatabase.updateLikesDislikes(like_dislike)

                likePost === 1 ?
                    await this.postDatabase.reverseLikeUp(postId) :
                    await this.postDatabase.reverseDislikeUp(postId)
            }
        }


























        /* if (!likesDislikesExists) {
            //1) criar um novo registro de likes_dislikes na tabela
            //1.1 - verifica se like é true ou false e chama os métodos de incrementar/decrementar o likes/dislikes de posts
            if (like) {
                likePost = 1
                    
                if (postDB.dislikes < 1) {
                    await this.postDatabase.incrementLike(postDB.id)
                } else {
                    await this.postDatabase.incrementLike(postDB.id)
                    await this.postDatabase.decrementDislike(postDB.id)
                }

            } else {
                likePost = 0

                if (postDB.likes < 1) { postLikeDislike.postIncrementDislike() }

                postLikeDislike.postDecreaseLike()
                postLikeDislike.postIncrementDislike()
            }
            
            const likeDislike = postLikeDislike.createLikeDislike(user_id, likePost)

            await this.likeDislikeDatabase.createLikesDislikes(likeDislike)
        }

        const updatedPostDB = postLikeDislike.postToDBModel()
        await this.postDatabase.updatePost(updatedPostDB) */






        /* let likeDB: number

        if (likesDislikesExists) {
            
            if (like) {
                
            }

            likeDB = likesDislikesExists.like === 0 ? 1 : 0
            likeDB === 1 ? editPostLikeDislike.postIncrementLike()
            
        } else {

            likeDB = like ? 1 : 0
            
        } */


        /* Atribuindo o valor de like a variável para transformar ela em number e poder aderir ao DB */
        /*  let likeDB: number = 0
         let dislikeDB: number = 0
         like ? likeDB = 1 : dislikeDB = 1
 
         if (like) {
             
         } */
        /*  const editPostLikeDislikeDB: PostModelDB = editPostLikeDislike.postToDBModel()
         await this.postDatabase.updatePost(editPostLikeDislikeDB) */
    }
}