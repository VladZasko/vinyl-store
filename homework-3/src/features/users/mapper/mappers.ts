import {UserType} from "../../../memoryDb/db";
import {UserViewModel} from "../models/output/UserViewModel";

export const userAuthMapper = (userDb:UserType):UserViewModel => {
    return{
        userId: userDb.userId,
        login: userDb.login,
        email: userDb.email,
        firstName: userDb.firstName,
        lastName: userDb.lastName,
        createdAt: userDb.createdAt
    }
}
