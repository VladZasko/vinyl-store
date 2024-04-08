import {UsersRepository} from "../repositories/userRepository";
import {CreateUserModel} from "../models/input/CreateUserModel";
import {UserViewModel} from "../models/output/UserViewModel";
import bcrypt from 'bcrypt'
import {UserType} from "../../../memoryDb/db";
import {v4 as uuidv4} from 'uuid';
import {userAuthMapper} from "../mapper/mappers";
import {UpdateUserModel} from "../models/input/UpdateUserModel";
import {emailAdapter} from "../adapters/email-adapter";



export class UsersService {
    constructor(
        protected usersRepository: UsersRepository,
    ) {}
    async createUser(createData: CreateUserModel): Promise<UserViewModel> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(createData.password, passwordSalt)

        const newUser:UserType = {
            userId: uuidv4(),
            login: createData.login,
            email: createData.email,
            lastName: createData.lastName,
            firstName: createData.firstName,
            createdAt: new Date().toISOString(),
            passwordHash,
            passwordSalt
        }
        const createResult = await this.usersRepository.createUser(newUser)

        return createResult
    }

    async updateUser(user: UserViewModel, updateData:UpdateUserModel) {

        const updateUser = await this.usersRepository.updateUser(user, updateData)

        if (updateData){
            try {
                await emailAdapter.sendNotification(user, updateData)
            } catch (error) {
                console.error(error)
                return false
            }
        }

        return updateUser
    }

    async checkCredentials(email: string, password: string): Promise<UserViewModel | null> {
        const user = await UsersRepository.findByEmail(email)
        if (!user) {
            return null
        }

        const passwordHash = await this._generateHash(password, user.passwordHash)

        if (user.passwordHash !== passwordHash) {
            return null
        }

        return userAuthMapper(user)

    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

}