import { PostsType } from '../../../../memoryDb/db';

export type UpdatePostDTO = Pick<PostsType, 'title' | 'description' | 'postId'>;
