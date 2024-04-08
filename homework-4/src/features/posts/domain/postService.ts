import {PostsRepository} from "../repositories/postRepository";
import {PostsViewType} from "../models/output/PostsViewModel";
import {v4 as uuidv4} from "uuid";
import {CreatePostDTO} from "../models/input/CreatePostModel";
import {UpdatePostDTO} from "../models/input/UpdatePostModel";
import {PostsType} from "../../../memoryDb/db";


export class PostsService {
    constructor(
        protected postsRepository: PostsRepository,
    ) {}

    async createPost(createData: CreatePostDTO): Promise<PostsViewType>  {
        const newPost: PostsType = {
            fullName: createData.fullName,
            title: createData.title,
            description: createData.description,
            userId: createData.userId,
            postId: uuidv4(),
            createdAt: new Date().toISOString(),
        }

        return await this.postsRepository.createPost(newPost)
    }
    async updatePost(upData: UpdatePostDTO): Promise<boolean> {
        return await this.postsRepository.updatePost(upData)
    }
    async deletePostById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(id)
    }
}