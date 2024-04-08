import {UserViewModel} from "../features/users/models/output/UserViewModel";


declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null,
        }
    }
}