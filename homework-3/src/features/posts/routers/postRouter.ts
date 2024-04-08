import {Router} from "express";
import {authAccessTokenMiddleware} from "../../../middlewares/auth/auth-accessToken-middleware";
import {postValidator} from "../validator/postValidator";
import {postsController} from "../../composition-root";

export const postsRouter = Router({})


postsRouter.get('/', authAccessTokenMiddleware, postsController.getPost.bind(postsController))
postsRouter.post('/', authAccessTokenMiddleware, postValidator(), postsController.createPost.bind(postsController))
postsRouter.put('/:id', authAccessTokenMiddleware, postValidator(), postsController.updatePost.bind(postsController))
postsRouter.delete('/:id', authAccessTokenMiddleware, postsController.deletePost.bind(postsController))

