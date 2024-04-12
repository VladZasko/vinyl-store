import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import {
  PostsViewType,
  PostsViewTypeWithLike,
} from './models/output/PostsViewModel';
import { CreatePostData, CreatePostDTO } from './models/input/CreatePostModel';
import { UsersRepository } from '../user/repository/user.repository';
import { LikesType, PostsType } from '../../memoryDb/db';
import { UpdatePostDTO } from './models/input/UpdatePostModel';
import { PostsService } from './domain/posts.servis';
import { PostsRepository } from './repository/posts.repository';
import { UserViewModel } from '../user/models/output/UserViewModel';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('all-posts')
  async getAllPosts(@Request() req): Promise<PostsViewTypeWithLike[]> {
    const posts: PostsViewTypeWithLike[] | null =
      await this.postsRepository.getAllPosts(req.user.userId);

    if (!posts) throw new NotFoundException('Post not found');

    return posts;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getPosts(@Request() req): Promise<PostsViewTypeWithLike[]> {
    const posts: PostsViewTypeWithLike[] | null =
      await this.postsRepository.getPostsById(req.user!.userId);

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
    const user: UserViewModel = await this.usersRepository.getUserById(
      req.user.userId,
    );

    const createData: CreatePostDTO = {
      fullName: `${user.firstName} ${user.lastName}`,
      title: inputModel.title,
      description: inputModel.description,
      userId: req.user!.userId,
    };

    return await this.postsService.createPost(createData);
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
      await this.postsRepository.getPostById(postId);

    if (!post) throw new NotFoundException('Post not found');

    if (post!.userId !== req.user!.userId)
      throw new ForbiddenException('Action prohibited for the specified post');

    const upData: UpdatePostDTO = {
      postId: postId,
      title: inputModel.title,
      description: inputModel.description,
    };

    await this.postsService.updatePost(upData);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/like-status')
  async updateLikes(
    @Request() req,
    @Param('id') postId: string,
  ): Promise<void> {
    const user: UserViewModel = await this.usersRepository.getUserById(
      req.user.userId,
    );

    const upData: LikesType = {
      userId: user!.userId,
      postId: postId,
    };

    const post: PostsType = await this.postsRepository.getPostById(postId);

    if (!post) throw new NotFoundException('Post not found');

    await this.postsService.updateLikeStatus(upData);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Request() req, @Param('id') postId: string): Promise<void> {
    const post: PostsType | null =
      await this.postsRepository.getPostById(postId);

    if (!post) throw new NotFoundException('Post not found');

    if (post!.userId !== req.user!.userId)
      throw new ForbiddenException('Action prohibited for the specified post');

    await this.postsService.deletePostById(req.params.id);

    return;
  }
}
