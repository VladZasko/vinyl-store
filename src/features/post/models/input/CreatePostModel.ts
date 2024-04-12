import { PostsType } from '../../../../memoryDb/db';
import { Length } from 'class-validator';

export class CreatePostData {
  @Length(3, 30)
  title: string;

  @Length(3, 1000)
  description: string;
}

export type CreatePostDTO = Pick<
  PostsType,
  'fullName' | 'title' | 'description' | 'userId'
>;
