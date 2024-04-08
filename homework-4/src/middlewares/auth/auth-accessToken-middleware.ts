import {Response, Request, NextFunction} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import jwt from "jsonwebtoken";
import {settings} from "../../settings";
import {jwtService} from "../../features/users/application/jwt-service";
import {UsersRepository} from "../../features/users/repositories/userRepository";
import {UserViewModel} from "../../features/users/models/output/UserViewModel";

export const authAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction)=> {
    const auth: string | undefined = req.headers['authorization']

    if(!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const [bearer, token]= auth.split(" ")

    if(bearer !== 'Bearer'){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return;
    }

    const isValidJWT = (t: string) => /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/.test(t);

    if(!isValidJWT(token)){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return;
    }

    try {
        jwt.verify(token, settings.JWT_SECRET)
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const userId: string | null = await jwtService.getUserIdByAccessToken(token)
    if (userId !== null) {
        const user: UserViewModel | null = await UsersRepository.getUserById(userId)
        if(user){
            req.user = user
            next()
        } else {
            res.status(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
    }
    res.status(HTTP_STATUSES.UNAUTHORIZED_401)
    return
}