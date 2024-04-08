import {UsersRepository} from "./users/repositories/userRepository";
import {UsersService} from "./users/domain/userService";
import {UsersController} from "./users/usersController";
import {PostsRepository} from "./posts/repositories/postRepository";
import {PostsService} from "./posts/domain/postService";
import {PostsController} from "./posts/postController";


const userRepository: UsersRepository = new UsersRepository()
const usersService: UsersService = new UsersService(userRepository)

const postsRepository: PostsRepository = new PostsRepository()
const postsService: PostsService = new PostsService(postsRepository)

export const usersController: UsersController = new UsersController(usersService)
export const postsController: PostsController = new PostsController(postsService, postsRepository)

