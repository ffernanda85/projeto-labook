import { TokenPayload } from "./User"


export interface PostModelDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface CreatorPost {
    id: string,
    name: string
}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: CreatorPost
}

export class Post {
    constructor(
        private id: string,
        private creatorId: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string
    ) { }
    
    public getId() : string {
        return this.id
    }

    public getCreatorId() : string {
        return this.creatorId
    }
    public setCreatorId(newCreatorId : string) {
        this.creatorId = newCreatorId;
    }
    
    public getContent() : string {
        return this.content
    }
    public setContent(newContent : string) {
        this.content = newContent;
    }

    public getLikes() : number {
        return this.likes
    }
    public setLikes(newLikes : number) {
        this.likes = newLikes;
    }

    public getDislikes() : number {
        return this.dislikes
    }
    public setDislikes(newDislikes : number) {
        this.dislikes = newDislikes;
    }

    public getCreatedAt() : string {
        return this.createdAt
    }
    public setCreatedAt(newCreatedAt : string) {
        this.createdAt = newCreatedAt;
    }

    public getUpdatedAt() : string {
        return this.updatedAt
    }
    public setUpdatedAt(newUpdatedAt : string) {
        this.updatedAt = newUpdatedAt;
    }

    /* método para gerar o PostDB a partir da instância de Post */
    postToDBModel = (): PostModelDB => {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }

    /* método do GetPost */
    postToBusinessModel = (payload: TokenPayload): PostModel => {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: payload.id,
                name: payload.name
            }
        }
    }




}