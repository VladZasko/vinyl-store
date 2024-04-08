import  {Response, Request} from "express";
import {UsersService} from "./domain/userService";
import {HTTP_STATUSES} from "../../utils/utils";
import {LoginAuthUserModel} from "./models/input/LoginAuthUserModel";
import {jwtService} from "./application/jwt-service";
import {UpdateUserModel} from "./models/input/UpdateUserModel";
import {UserType} from "../../memoryDb/db";

export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async login(req: Request<LoginAuthUserModel>, res: Response) {

        const user = await this.usersService.checkCredentials(req.body.email, req.body.password)

        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const accessToken = await jwtService.createJWTAccessToken(user.userId)

        res
            .status(HTTP_STATUSES.OK_200).send(accessToken)
        return
    }

    async createUser(req: Request, res: Response) {

        const createData = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
            lastName: req.body.lastName,
            firstName: req.body.firstName
        }

        const newUser = await this.usersService.createUser(createData)

        if (newUser) {
            res.status(HTTP_STATUSES.CREATED_201)
                .send(newUser)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    }

    async updateUser(req: Request, res: Response) {

        const updateData:UpdateUserModel = {
            lastName: req.body.lastName,
            firstName: req.body.firstName
        }

        await this.usersService.updateUser(req.user!,updateData)

        res.sendStatus (HTTP_STATUSES.NO_CONTENT_204)
    }

    async meProfile(req: Request, res: Response) {
            const myProfile = {
                firstName: req.user!.firstName,
                lastName: req.user!.lastName,
                email: req.user!.email
            }

            res.status(HTTP_STATUSES.OK_200).send(myProfile)
            return
        }
}