import { PostsType } from '../PostType';

export type UpdatePostType = Pick<PostsType, 'title' | 'description' | 'id'>;
