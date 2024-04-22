import { Inject, Injectable } from '@nestjs/common';
import { PostSqlRepository } from '../repository/post.sql.repository';
import { CreatePostDTO } from '../models/input/CreatePostModel';
import { UpdatePostType } from '../models/input/UpdatePostModel';
import { Post } from '../../../db/sql/entity/post.entity';
import { PostMongoDbRepository } from '../repository/post.mongoDb.repository';
import { Like } from '../../../db/sql/entity/like.entity';
import { LikeUpdateModel } from '../models/input/LikeUpdateModel';
import { PostMongoType } from '../../../db/mongoDb/schemes/post.schemes';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostSqlRepository) protected postsRepository: PostSqlRepository,
    @Inject(PostMongoDbRepository)
    protected postMongoDbRepository: PostMongoDbRepository,
  ) {}

  async createPost(createData: CreatePostDTO): Promise<Post> {
    const newPost: Post = new Post();

    newPost.fullName = createData.fullName;
    newPost.title = createData.title;
    newPost.description = createData.description;
    newPost.userId = createData.userId;
    newPost.createdAt = new Date().toISOString();

    const post: Post = await this.postsRepository.createPost(newPost);

    const createPostMongoDb: PostMongoType = {
      _id: post.id,
      createdAt: post.createdAt,
      ...createData,
    };
    await this.postMongoDbRepository.createPost(createPostMongoDb);

    return post;
  }
  async updatePost(upData: UpdatePostType): Promise<Post> {
    const post: Post = await this.postsRepository.getPostById(upData.id);

    post.title = upData.title;
    post.description = upData.description;

    const updatePost: Post = await this.postsRepository.updatePost(post);

    await this.postMongoDbRepository.updatePost(upData);

    return updatePost;
  }

  async updateLikeStatus(upData: LikeUpdateModel): Promise<boolean> {
    const findLike: Like = await this.postsRepository.findLike(upData);

    if (!findLike) {
      const newLike: Like = new Like();

      newLike.userId = upData.userId;
      newLike.postId = upData.postId;

      const like: Like = await this.postsRepository.createLike(newLike);

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
