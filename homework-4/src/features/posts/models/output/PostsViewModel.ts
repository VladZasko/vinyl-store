import {PostsType} from "../../../../memoryDb/db";

export type PostsViewType = Omit<PostsType, "userId">