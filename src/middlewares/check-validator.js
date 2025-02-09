import { body, param } from "express-validator";
import { existeEmail, existeUsername, userExist } from "../helpers/db-validator.js";
import { validarCampos } from "./validar-campos.js";


export const registerValidator = [
    body("name", "El nombre es obligatorio").not().isEmpty(),
    body("name", "El nombre no puede exceder los 25 caracteres").isLength({ max: 25 }),
    body("surname", "El apellido es obligatorio").not().isEmpty(),
    body("surname", "El apellido no puede exceder los 25 caracteres").isLength({ max: 25 }),
    body("username", "El username es obligatorio").not().isEmpty(),
    body("email", "El correo es obligatorio").not().isEmpty(),
    body("email", "Ingrese un correo válido").isEmail(),
    body("email").custom(existeEmail),
    body("username").custom(existeUsername),
    body("phone", "El teléfono es obligatorio").not().isEmpty(),
    body("phone", "El teléfono debe tener exactamente 8 dígitos").isLength({ min: 8, max: 8 }).isNumeric(),
    body("password", "La contraseña es obligatoria").not().isEmpty(),
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }),
    /* body("password", "Su contraseña es muy débil").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    }),*/
    body("role", "El rol es obligatorio").not().isEmpty(),
    body("role", "Rol no válido").isIn(["TEACHER_ROLE", "STUDENT_ROLE"]),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Ingrese un correo válido"),
    body("username").optional().isString().withMessage("Ingrese un username válido"),
    body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
    validarCampos
];

export const getUserByIdValidator = [
    param("uid").isMongoId().withMessage("No es un ID válido"),
    param("uid").custom(userExist),
    validarCampos
];

export const deleteUserValidator = [
    param("uid").isMongoId().withMessage("No es un ID válido"),
    param("uid").custom(userExist),
    validarCampos
];

export const updatePasswordValidator = [
    param("uid").isMongoId().withMessage("No es un ID válido"),
    param("uid").custom(userExist),
    body("newPassword").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
    validarCampos
];

export const courseValidator = [
    body("cursos").custom((cursos, { req }) => {
        if (req.body.role === 'STUDENT_ROLE' && cursos.length > 3) {
            throw new Error("Un alumno solo puede estar en un máximo de 3 cursos");
        }
        return true;
    }),
    validarCampos
];