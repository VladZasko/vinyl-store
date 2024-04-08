import {PostsRepository} from "../repositories/postRepository";
import {PostsViewType} from "../models/output/PostsViewModel";
import {v4 as uuidv4} from "uuid";


export class PostsService {
    constructor(
        protected postsRepository: PostsRepository,
    ) {}

    async createPost(createData:any):Promise<PostsViewType>  {
        const newPost = {
            fullName: createData.fullName,
            title: createData.title,
            description: createData.description,
            userId: createData.userId,
            postId: uuidv4(),
            createdAt: new Date().toISOString(),
        }

        return await this.postsRepository.createPost(newPost)
    }
    async updatePost(upData: any): Promise<boolean> {
        return await this.postsRepository.updatePost(upData)
    }
    async deletePostById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(id)
    }
}