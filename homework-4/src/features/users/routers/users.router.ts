import {usersController} from "../../composition-root";
import {Router} from "express";
import {authValidation} from "../validator/auth-validator";
import {authRegistrationValidator} from "../validator/auth-registration-validator";
import {updateProfileValidator} from "../validator/update-profile-validator";
import {authAccessTokenMiddleware} from "../../../middlewares/auth/auth-accessToken-middleware";

export const usersRouter: Router = Router({})


usersRouter.post('/login', authValidation(), usersController.login.bind(usersController))
usersRouter.post('/registration', authRegistrationValidator(), usersController.createUser.bind(usersController))
usersRouter.put('/update-profile', authAccessTokenMiddleware, updateProfileValidator(), usersController.updateUser.bind(usersController))
usersRouter.get('/me', authAccessTokenMiddleware, usersController.meProfile.bind(usersController))

