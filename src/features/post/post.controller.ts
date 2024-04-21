import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsViewType } from './models/output/PostViewModel';
import { CreatePostData, CreatePostDTO } from './models/input/CreatePostModel';
import { UserRepository } from '../user/repository/user.repository';
import { UpdatePostDTO } from './models/input/UpdatePostModel';
import { PostService } from './domain/post.service';
import { PostRepository } from './repository/post.repository';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { QueryPostsModel } from './models/input/QueryPostModule';
import { User } from '../../db/entity/user.entity';
import { PostsType } from './models/PostType';

@Controller('posts')
export class PostController {
  constructor(
    @Inject(PostService) protected postService: PostService,
    @Inject(PostRepository) protected postRepository: PostRepository,
    @Inject(UserRepository) protected userRepository: UserRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('all-posts')
  async getAllPosts(@Query() query: QueryPostsModel) {
    const posts = await this.postRepository.getAllPosts(query);

    if (!posts) throw new NotFoundException('Post not found');

    return posts;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getPosts(@Query() query: QueryPostsModel, @Request() req) {
    const posts = await this.postRepository.getPostsById(
      query,
      req.user.userId,
    );

    if (!posts) throw new NotFoundException('Post not found');

    return posts;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPost(
    @Request() req,
    @Body() inputModel: CreatePostData,
  ): Promise<PostsViewType> {
    const user: User = await this.userRepository.getUserById(req.user.userId);

    const createData: CreatePostDTO = {
      fullName: `${user.firstName} ${user.lastName}`,
      title: inputModel.title,
      description: inputModel.description,
      userId: user!.id,
    };

    return await this.postService.createPost(createData);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updatePost(
    @Request() req,
    @Body() inputModel: CreatePostData,
    @Param('id') postId: string,
  ): Promise<void> {
    const post: PostsType | null =
      await this.postRepository.getPostById(postId);

    if (!post) throw new NotFoundException('Post not found');

    if (post!.userId !== req.user!.userId)
      throw new ForbiddenException('Action prohibited for the specified post');

    const upData: UpdatePostDTO = {
      id: postId,
      title: inputModel.title,
      description: inputModel.description,
    };

    await this.postService.updatePost(upData);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/like-status')
  async updateLikes(
    @Request() req,
    @Param('id') postId: string,
  ): Promise<void> {
    const user: User = await this.userRepository.getUserById(req.user.userId);

    const upData = {
      userId: user!.id,
      postId: postId,
    };

    const post: PostsType = await this.postRepository.getPostById(postId);

    if (!post) throw new NotFoundException('Post not found');

    await this.postService.updateLikeStatus(upData);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Request() req, @Param('id') postId: string): Promise<void> {
    const post: PostsType | null =
      await this.postRepository.getPostById(postId);

    if (!post) throw new NotFoundException('Post not found');

    if (post!.userId !== req.user!.userId)
      throw new ForbiddenException('Action prohibited for the specified post');

    await this.postService.deletePostById(req.params.id);

    return;
  }
}
