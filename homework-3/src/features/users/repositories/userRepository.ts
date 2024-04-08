import {db, UserType} from "../../../memoryDb/db";
import {UserViewModel} from "../models/output/UserViewModel";
import {userAuthMapper} from "../mapper/mappers";
import {UpdateUserModel} from "../models/input/UpdateUserModel";

export class UsersRepository {
    async createUser(createData: UserType): Promise<UserViewModel> {

        db.users.push(createData)

        return {
            userId: createData.userId,
            login: createData.login,
            email: createData.email,
            firstName: createData.firstName,
            lastName: createData.lastName,
            createdAt: createData.createdAt
        }
    }

    async updateUser(user: UserViewModel, updateData:UpdateUserModel) {
        const updateUser = db.users.find(c => c.userId === user.userId);

        if(!updateUser) {
            return null;
        }

        updateUser.lastName = updateData.lastName;
        updateUser.firstName = updateData.firstName;

        return
    }

    static async getUserById(id: string): Promise<UserViewModel | null> {
        const user = db.users.find(v => v.userId === id)

        if (!user){
            return null
        }

        return userAuthMapper(user)
    }

    static async findByEmail(email: string) {
        return db.users.find(v => v.email === email)
    }
}