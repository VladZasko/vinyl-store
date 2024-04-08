import {body, ValidationChain} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {UsersRepository} from "../repositories/userRepository";
export const firstNameValidation: ValidationChain = body('firstName').isString().trim().isLength({min:3, max:15}).withMessage('Incorrect firstName!')
export const lastNameValidation: ValidationChain = body('lastName').isString().trim().isLength({min:3, max:15}).withMessage('Incorrect lastName!')

export const updateProfileValidator = () => [ firstNameValidation, lastNameValidation, inputValidation]

