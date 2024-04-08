import {UsersRepository} from "./users/repositories/userRepository";
import {UsersService} from "./users/domain/userService";
import {db} from "../memoryDb/db";
import {UsersController} from "./users/usersController";
import {PostsRepository} from "./posts/repositories/postRepository";
import {PostsService} from "./posts/domain/postService";
import {PostsController} from "./posts/postController";


const userRepository = new UsersRepository()
const usersService = new UsersService(userRepository)

const postsRepository = new PostsRepository()
const postsService = new PostsService(postsRepository)

export const usersController = new UsersController(usersService)
export const postsController = new PostsController(postsService, postsRepository)

