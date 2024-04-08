import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";
import {UsersRepository} from "../repositories/userRepository";


export const loginValidation = body('login').isString().trim().isLength({min:3, max:10}).withMessage('Incorrect login!')

export const firstNameValidation = body('firstName').isString().trim().isLength({min:2, max:30}).withMessage('Incorrect firstName!')

export const lastNameValidation = body('lastName').isString().trim().isLength({min:2, max:30}).withMessage('Incorrect lastName!')

export const passwordValidation = body('password').isString().trim().isLength({min:6, max:20})
    .withMessage('Incorrect password!')
    .matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect password!')
export const emailValidation = body('email').isString().trim()
    .withMessage('Incorrect email!')
    .matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$').withMessage('Incorrect email!')
    .custom(async (value) => {
        const email = await UsersRepository.findByEmail(value)
        if (email) {
            throw Error('Email already exists!')
        }
        return true
    }).withMessage('Email already exists!')
export const authRegistrationValidator = () => [ loginValidation, firstNameValidation, lastNameValidation, passwordValidation, emailValidation, inputValidation]

