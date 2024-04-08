import  {Response, Request} from "express";
import {UsersService} from "./domain/userService";
import {HTTP_STATUSES} from "../../utils/utils";
import {LoginAuthUserModel} from "./models/input/LoginAuthUserModel";
import {jwtService} from "./application/jwt-service";
import {UpdateUserModel} from "./models/input/UpdateUserModel";
import {RequestWithBody, RequestWithParamsAndBody} from "../../utils/types";
import {UserViewModel} from "./models/output/UserViewModel";
import {CreateUserModel} from "./models/input/CreateUserModel";
import {URIParamsUserIdModel} from "./models/input/URIParamsUserIdModel";
import {ProfileViewModel} from "./models/output/ProfileViewModel";

export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async login(req: RequestWithBody<LoginAuthUserModel>, res: Response) {

        const user: UserViewModel | null = await this.usersService.checkCredentials(req.body.email, req.body.password)

        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const accessToken: string = await jwtService.createJWTAccessToken(user.userId)

        res
            .status(HTTP_STATUSES.OK_200).send(
                {
                    accessToken: accessToken
                })
        return
    }

    async createUser(req: RequestWithBody<CreateUserModel>, res: Response) {

        const createData: CreateUserModel = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
            lastName: req.body.lastName,
            firstName: req.body.firstName
        }

        const newUser: UserViewModel = await this.usersService.createUser(createData)

        if (newUser) {
            res.status(HTTP_STATUSES.CREATED_201)
                .send(newUser)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    }

    async updateUser(req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel>, res: Response) {

        const updateData: UpdateUserModel = {
            lastName: req.body.lastName,
            firstName: req.body.firstName
        }

        const updateUser: boolean = await this.usersService.updateUser(req.user!, updateData)

        if (updateUser) {
            res.sendStatus (HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }

    }

    async meProfile(req: Request, res: Response) {
            const myProfile: ProfileViewModel = {
                firstName: req.user!.firstName,
                lastName: req.user!.lastName,
                email: req.user!.email
            }

            res
                .status(HTTP_STATUSES.OK_200)
                .send(myProfile)
            return
        }
}