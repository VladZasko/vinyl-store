import jwt from 'jsonwebtoken'
import {settings} from "../../../settings";

export const jwtService = {
    async createJWTAccessToken(userId: string):Promise<{accessToken:string}> {
        const token = jwt.sign(
            {userId: userId},
            settings.JWT_SECRET,
            {expiresIn: 1000})
        return {
            accessToken: token.toString()
        }
    },

    async getUserIdByAccessToken(token: string):Promise<string|null> {
        try {
            const result:any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}