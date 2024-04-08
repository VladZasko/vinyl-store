import {db, postsType} from "../../../memoryDb/db";
import {PostsViewType} from "../models/output/PostsViewModel";
import {postMapper} from "../mapper/postMapper";

export class PostsRepository {

    async getPostsById(id: string): Promise<PostsViewType[] | null> {
        const posts = db.posts.filter(v => v.userId === id)
        if (!posts){
            return null
        }

        return posts.map(postMapper)
    }

    async getPostById(id: string): Promise<postsType | null> {
        const post = db.posts.find(v => v.postId === id)

        if (!post){
            return null
        }

        return post
    }


    async createPost(createData:any):Promise<PostsViewType>  {

        db.posts.push(createData)

        return {
            postId: createData.postId,
            fullName: createData.fullName,
            title: createData.title,
            description: createData.description,
            createdAt: createData.createdAt
        }
    }

    async updatePost(upData: any): Promise<boolean> {
        const foundPost = db.posts.find(c => c.postId === upData.postId);

        if(!foundPost) {
            return false;
        }

        foundPost.title = upData.title;
        foundPost.description = upData.description;

        return true
    }

    async deletePostById(id: string): Promise<boolean> {
        db.posts = db.posts.filter(v => v.postId !== id)

        return true
    }
}