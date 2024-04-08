import {body, ValidationChain} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {UsersRepository} from "../repositories/userRepository";
import {UserType} from "../../../memoryDb/db";


export const loginValidation: ValidationChain = body('login').isString().trim().isLength({min:3, max:10}).withMessage('Incorrect login!')

export const firstNameValidation: ValidationChain = body('firstName').isString().trim().isLength({min:2, max:30}).withMessage('Incorrect firstName!')

export const lastNameValidation: ValidationChain = body('lastName').isString().trim().isLength({min:2, max:30}).withMessage('Incorrect lastName!')

export const passwordValidation: ValidationChain = body('password').isString().trim().isLength({min:6, max:20})
    .withMessage('Incorrect password!')
    .matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect password!')
export const emailValidation: ValidationChain = body('email').isString().trim()
    .withMessage('Incorrect email!')
    .matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$').withMessage('Incorrect email!')
    .custom(async (value) => {
        const email: UserType | undefined = await UsersRepository.findByEmail(value)
        if (email) {
            throw Error('Email already exists!')
        }
        return true
    }).withMessage('Email already exists!')
export const authRegistrationValidator = () => [ loginValidation, firstNameValidation, lastNameValidation, passwordValidation, emailValidation, inputValidation]

