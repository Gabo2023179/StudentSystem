import { body, param } from "express-validator";
import { existeEmail, existeUsername, userExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validar-campos.js";
import { deleteFileOnError } from "./delete-file-on-error.js";



export const registerValidator = [
    body("name", "El nombre es obligatorio").not().isEmpty(),
    body("username", "El username es obligatorio").not().isEmpty(),
    body("email", "El correo es obligatorio").not().isEmpty(),
    body("email", "Ingrese un correo valido").isEmail(),
    body("email").custom(existeEmail),
    body("username").custom(existeUsername),
   /* body("password", "Su contrasena es muy debil").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    }),*/
    validarCampos,
    deleteFileOnError
]

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Ingrese un correo valido"),
    body("username").optional().isString().withMessage("Ingrese un username valido"),
    body("password").isLength({min: 8}).withMessage("La contrasena debe tener al menos 8 caracteres"),
    validarCampos
]

export const getUserByIdValidator = [
    param("uid").isMongoId().withMessage("no es un ID valido"),
    param("uid").custom(userExists),
    validarCampos,
    deleteFileOnError
]

export const deleteUserValidator = [
    param("uid").isMongoId().withMessage("no es un ID valido"),
    param("uid").custom(userExists),
    validarCampos,
    deleteFileOnError
]

export const updatePasswordValidator = [
    param("uid").isMongoId().withMessage("no es un ID valido"),
    param("uid").custom(userExists),
    body("newPassword").isLength({min: 8}).withMessage("La contra debe tener al menos 8 caracteres"),
    validarCampos,
    deleteFileOnError
]