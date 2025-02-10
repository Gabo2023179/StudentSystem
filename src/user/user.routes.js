import { Router } from "express";
import {getUserByIdValidator, deleteUserValidator, updatePasswordValidator, registerValidator, courseValidator } from "../middlewares/check-validator.js"; // Asegúrate de que el nombre del archivo de validadores sea correcto
import {getUserById, getUsers, deleteUser,updatePassword,registerUser,assignCourse,getCourses,updateUser, editCourse, deleteCourse } from "./user.controller.js";

const router = Router();

// Rutas para usuarios
router.post("/register", registerValidator, registerUser);
router.get("/findUser/:uid", getUserByIdValidator, getUserById);
router.get("/", getUsers);
router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser);
router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword);
router.patch("/updateUser/:uid", updateUser); // Ruta para actualizar el perfil del usuario

// Rutas para cursos
router.post("/assignCourse/:uid", courseValidator, assignCourse); // Asignar curso a estudiante
router.get("/getCourses/:uid", getCourses); // Obtener cursos asignados
router.patch("/editCourse", editCourse); // Editar curso y actualizar estudiantes
router.delete("/deleteCourse", deleteCourse); // Eliminar curso y desasignar estudiantes

export default router;