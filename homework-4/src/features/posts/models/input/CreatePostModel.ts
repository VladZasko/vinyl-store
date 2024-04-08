import {PostsType} from "../../../../memoryDb/db";

export type CreatePostData = Pick<PostsType, "title" | "description">

export type CreatePostDTO = Pick<PostsType, "fullName" | "title" | "description" | "userId">

