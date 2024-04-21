import { Inject, Injectable } from '@nestjs/common';
import { PostSqlRepository } from '../repository/post.sql.repository';
import { PostsViewType } from '../models/output/PostViewModel';
import { CreatePostDTO } from '../models/input/CreatePostModel';
import { UpdatePostDTO } from '../models/input/UpdatePostModel';
import { Post } from '../../../db/entity/post.entity';
import { PostMongoDbRepository } from '../repository/post.mongoDb.repository';
import { Like } from '../../../db/entity/like.entity';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostSqlRepository) protected postsRepository: PostSqlRepository,
    @Inject(PostMongoDbRepository)
    protected postMongoDbRepository: PostMongoDbRepository,
  ) {}

  async createPost(createData: CreatePostDTO): Promise<PostsViewType> {
    const newPost: Post = new Post();

    newPost.fullName = createData.fullName;
    newPost.title = createData.title;
    newPost.description = createData.description;
    newPost.userId = createData.userId;
    newPost.createdAt = new Date().toISOString();

    const post = await this.postsRepository.createPost(newPost);

    const createPostMongoDb = {
      _id: post.id,
      createdAt: post.createdAt,
      ...createData,
    };
    await this.postMongoDbRepository.createPost(createPostMongoDb);

    return post;
  }
  async updatePost(upData: UpdatePostDTO): Promise<Post> {
    const post: Post = await this.postsRepository.getPostById(upData.id);

    post.title = upData.title;
    post.description = upData.description;

    const updatePost = await this.postsRepository.updatePost(post);

    await this.postMongoDbRepository.updatePost(upData);

    return updatePost;
  }

  async updateLikeStatus(upData: any): Promise<boolean> {
    const findLike = await this.postsRepository.findLike(upData);

    if (!findLike) {
      const newLike: Like = new Like();

      newLike.userId = upData.userId;
      newLike.postId = upData.postId;

      const like = await this.postsRepository.createLike(newLike);

      const newLikeMongo = {
        _id: like.id,
        userId: upData.userId,
        postId: upData.postId,
      };

      await this.postMongoDbRepository.createLike(newLikeMongo);
    } else {
      await this.postsRepository.deleteLikeById(findLike.id);
      await this.postMongoDbRepository.deleteLikeById(findLike.id);
    }

    return true;
  }
  async deletePostById(id: string): Promise<boolean> {
    await this.postsRepository.deletePostById(id);

    return await this.postMongoDbRepository.deletePostById(id);
  }
}
