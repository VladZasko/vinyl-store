import {body} from "express-validator";
import {inputValidation} from "../../../middlewares/input-modul-validation/input-validation";


export const titleValidation = body('title').isString().trim().isLength({min:1, max:30}).withMessage('Incorrect title!')

export const descriptionValidation = body('description').isString().trim().isLength({min:1, max:1000}).withMessage('Incorrect description!')

export const postValidator = () => [ titleValidation, descriptionValidation, inputValidation]

