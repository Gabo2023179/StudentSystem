import User from "../user/user.model.js";
import { hash, verify } from "argon2";

// Registro de usuario
export const register = async (req, res) => {
    try {
        const data = req.body;
        
        // Asignar STUDENT_ROLE si el usuario no especifica un rol
        if (!data.role) {
            data.role = "STUDENT_ROLE";
        }
        
        // Validar que el rol solo pueda ser TEACHER_ROLE o STUDENT_ROLE
        if (!["TEACHER_ROLE", "STUDENT_ROLE"].includes(data.role)) {
            return res.status(400).json({ 
                success: false,
                message: "Rol no válido. Debe ser 'TEACHER_ROLE' o 'STUDENT_ROLE'."
            });
        }

        const encryptedPassword = await hash(data.password);
        data.password = encryptedPassword;

        if (data.role === "STUDENT_ROLE" && Array.isArray(data.cursos) && data.cursos.length > 3) {
            return res.status(400).json({ 
                message: "Un alumno solo puede estar en un máximo de 3 cursos" 
            });
        }

        const user = await User.create(data);
        return res.status(201).json({ 
            message: "Usuario registrado exitosamente",
            name: user.name, 
            email: user.email,
            role: user.role
        });
    } catch (err) {
        return res.status(500).json({ 
            message: "Error al registrar usuario",
            error: err.message 
        });
    }
};

// Inicio de sesión
export const login = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (!user) {
            return res.status(404).json({ 
                message: "Credenciales inválidas",
                error: "Usuario no encontrado" 
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                 message: "Credenciales inválidas",
                 error: "Contraseña incorrecta" 
            });
        }

        return res.status(200).json({ 
            message: "Inicio de sesión exitoso",
            user 
        });
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            message: "Error en inicio de sesión",
            error: err.message 
        });
    }
};
