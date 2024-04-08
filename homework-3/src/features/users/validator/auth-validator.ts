import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";

export const emailValidation = body('email').isString().notEmpty().withMessage('empty Email')
export const passwordValidation = body('password').isString().notEmpty().withMessage('empty password')



export const authValidation = () => [  emailValidation, passwordValidation, inputValidation]



