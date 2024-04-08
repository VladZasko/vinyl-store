import  {Response, Request} from "express";
import {PostsService} from "./domain/postService";
import {PostsRepository} from "./repositories/postRepository";
import {HTTP_STATUSES} from "../../utils/utils";

export class PostsController {
    constructor(protected postsService: PostsService,
                protected postsRepository: PostsRepository) {
    }

    async getPost(req: Request, res: Response) {

        const post = await this.postsRepository.getPostsById(req.user!.userId)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.status(HTTP_STATUSES.OK_200)
            .send(post)
    }

    async createPost(req: Request, res: Response) {
        const createData = {
            fullName: `${req.user?.firstName} ${req.user?.lastName}`,
            title: req.body.title,
            description: req.body.description,
            userId: req.user?.userId
        }

        const newPost = await this.postsService.createPost(createData)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newPost)
    }

    async updatePost(req: Request, res: Response) {
        const post = await this.postsRepository.getPostById(req.params.id)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        if (post!.userId !== req.user!.userId) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return;
        }

        const upData = {
            postId: req.params.id,
            title: req.body.title,
            description: req.body.description,
        }

        const updatePost = await this.postsService.updatePost(upData)

        if (!updatePost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deletePost(req: Request, res: Response) {
        const post = await this.postsRepository.getPostById(req.params.id)

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        if (post!.userId !== req.user!.userId) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return;
        }

        const deleteComment = await this.postsService.deletePostById(req.params.id)

        if (!deleteComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}