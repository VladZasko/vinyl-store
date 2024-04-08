import {db, PostsType} from "../../../memoryDb/db";
import {PostsViewType} from "../models/output/PostsViewModel";
import {postMapper} from "../mapper/postMapper";
import {CreatePostDTO} from "../models/input/CreatePostModel";
import {UpdatePostDTO} from "../models/input/UpdatePostModel";

export class PostsRepository {

    async getPostsById(id: string): Promise<PostsViewType[] | null> {
        const posts: PostsType[] = db.posts.filter((v: PostsType) => v.userId === id)
        if (!posts){
            return null
        }

        return posts.map(postMapper)
    }

    async getPostById(id: string): Promise<PostsType | null> {
        const post: PostsType | undefined = db.posts.find((v: PostsType) => v.postId === id)

        if (!post){
            return null
        }

        return post
    }


    async createPost(createData: PostsType): Promise<PostsViewType>  {

        db.posts.push(createData)

        return {
            postId: createData.postId,
            fullName: createData.fullName,
            title: createData.title,
            description: createData.description,
            createdAt: createData.createdAt
        }
    }

    async updatePost(upData: UpdatePostDTO): Promise<boolean> {
        const foundPost: PostsType | undefined = db.posts.find((c: PostsType) => c.postId === upData.postId);

        if(!foundPost) {
            return false;
        }

        foundPost.title = upData.title;
        foundPost.description = upData.description;

        return true
    }

    async deletePostById(id: string): Promise<boolean> {
        db.posts = db.posts.filter((v: PostsType) => v.postId !== id)

        return true
    }
}