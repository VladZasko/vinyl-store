import { PostsType } from '../PostType';

export type UpdatePostDTO = Pick<PostsType, 'title' | 'description' | 'id'>;
