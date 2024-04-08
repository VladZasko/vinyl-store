import {postsType} from "../../../memoryDb/db";
import {PostsViewType} from "../models/output/PostsViewModel";

export const postMapper = (postDb:postsType):PostsViewType => {
    return {
        postId: postDb.postId,
        fullName: postDb.fullName,
        title: postDb.title,
        description: postDb.description,
        createdAt: postDb.createdAt
    }
}