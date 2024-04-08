import {body, ValidationChain} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";

export const emailValidation: ValidationChain = body('email').isString().notEmpty().withMessage('empty Email')
export const passwordValidation: ValidationChain = body('password').isString().notEmpty().withMessage('empty password')



export const authValidation = () => [  emailValidation, passwordValidation, inputValidation]



