import {UserType} from "../../../../memoryDb/db";

export type ProfileViewModel = Pick<UserType, "firstName" | "lastName" | "email">
