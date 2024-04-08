import  {Response, Request} from "express";
import {PostsService} from "./domain/postService";
import {PostsRepository} from "./repositories/postRepository";
import {HTTP_STATUSES} from "../../utils/utils";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../utils/types";
import {CreatePostData, CreatePostDTO} from "./models/input/CreatePostModel";
import {URIParamsPostIdModel} from "./models/input/URIParamsPostIdModel";
import {PostsType} from "../../memoryDb/db";
import {UpdatePostDTO} from "./models/input/UpdatePostModel";
import {PostsViewType} from "./models/output/PostsViewModel";

export class PostsController {
    constructor(protected postsService: PostsService,
                protected postsRepository: PostsRepository) {
    }

    async getPost(req: Request, res: Response) {

        const post: PostsViewType[] | null = await this.postsRepository.getPostsById(req.user!.userId)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.status(HTTP_STATUSES.OK_200)
            .send(post)
    }

    async createPost(req: RequestWithBody<CreatePostData>, res: Response) {
        const createData: CreatePostDTO = {
            fullName: `${req.user?.firstName} ${req.user?.lastName}`,
            title: req.body.title,
            description: req.body.description,
            userId: req.user!.userId
        }

        const newPost: PostsViewType = await this.postsService.createPost(createData)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newPost)
    }

    async updatePost(req: RequestWithParamsAndBody<URIParamsPostIdModel,CreatePostData>, res: Response) {
        const post: PostsType | null = await this.postsRepository.getPostById(req.params.id)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        if (post!.userId !== req.user!.userId) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return;
        }

        const upData: UpdatePostDTO = {
            postId: req.params.id,
            title: req.body.title,
            description: req.body.description,
        }

        const updatePost: boolean = await this.postsService.updatePost(upData)

        if (!updatePost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deletePost(req: RequestWithParams<URIParamsPostIdModel>, res: Response) {
        const post: PostsType | null = await this.postsRepository.getPostById(req.params.id)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        if (post!.userId !== req.user!.userId) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return;
        }

        const deleteComment: boolean = await this.postsService.deletePostById(req.params.id)

        if (!deleteComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}