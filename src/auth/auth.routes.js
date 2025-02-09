import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator, courseValidator } from "../middlewares/check-validator.js";

const router = Router();

router.post(
    "/register",
    registerValidator,
    courseValidator,
    register
)

router.post("/Login", loginValidator, login)

export default router
