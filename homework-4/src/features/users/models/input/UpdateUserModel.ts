import { UserType} from "../../../../memoryDb/db";


export type UpdateUserModel = Pick<UserType, "lastName" | "firstName">
