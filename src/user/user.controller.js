import { hash, verify } from "argon2";
import User from "./user.model.js";

// Obtener usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "El usuario no existe"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        });
    }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const { limits = 3, from = 0 } = req.query;
        const query = { status: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(from))
                .limit(Number(limits))
        ]);

        return res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al listar los usuarios",
            error: err.message
        });
    }
};

// Registrar usuario
export const registerUser = async (req, res) => {
    try {
        const { name, surname, username, password, email, phone, role = "STUDENT_ROLE" } = req.body;

        // Verificar si el email ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "El email ya está en uso"
            });
        }

        const hashedPassword = await hash(password);

        const newUser = new User({
            name,
            surname,
            username: username || email.split("@")[0], // Usar email como fallback
            password: hashedPassword,
            email,
            phone,
            role
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            user: newUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al registrar el usuario",
            error: err.message
        });
    }
};

// Asignar curso a estudiante
export const assignCourse = async (req, res) => {
    try {
        const { uid } = req.params;
        const { courseName } = req.body; // El curso es solo un String

        // Validar que courseName sea un string válido
        if (!courseName || typeof courseName !== "string" || courseName.trim() === "") {
            return res.status(400).json({ message: "El nombre del curso no es válido" });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.role !== "STUDENT_ROLE") {
            return res.status(400).json({ message: "Solo los estudiantes pueden asignarse a cursos" });
        }

        if (!Array.isArray(user.cursos)) {
            user.cursos = [];
        }

        if (user.cursos.includes(courseName)) {
            return res.status(400).json({ message: "El estudiante ya está asignado a este curso" });
        }

        if (user.cursos.length >= 3) {
            return res.status(400).json({ message: "Un estudiante no puede estar en más de 3 cursos" });
        }

        user.cursos.push(courseName);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Curso asignado exitosamente",
            cursos: user.cursos
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al asignar el curso",
            error: err.message
        });
    }
};


// Visualizar cursos asignados
export const getCourses = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            courses: user.cursos
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los cursos",
            error: err.message
        });
    }
};

// Editar perfil
export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const { name, surname, username, email, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(uid, { name, surname, username, email, phone }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Perfil actualizado exitosamente",
            user: updatedUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el perfil",
            error: err.message
        });
    }
};

// Eliminar perfil
export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;

        await User.findByIdAndUpdate(uid, { status: false });

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado exitosamente"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        });
    }
};

// Actualizar contraseña
export const updatePassword = async (req, res) => {
    try {
        const { uid } = req.params;
        const { newPassword } = req.body;

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const matchPassword = await verify(user.password, newPassword);
        if (matchPassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            });
        }

        const encryptedPassword = await hash(newPassword);
        await User.findByIdAndUpdate(uid, { password: encryptedPassword });

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la contraseña",
            error: err.message
        });
    }
};

// Editar curso y actualizar estudiantes
export const editCourse = async (req, res) => {
    try {
        const { oldCourseName, newCourseName } = req.body;

        if (!oldCourseName || !newCourseName) {
            return res.status(400).json({
                success: false,
                message: "Se requieren los nombres del curso actual y nuevo."
            });
        }

        await User.updateMany(
            { cursos: oldCourseName },
            { $set: { "cursos.$": newCourseName } }
        );

        return res.status(200).json({
            success: true,
            message: "Curso actualizado correctamente."
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el curso",
            error: err.message
        });
    }
};

// Eliminar curso y desasignarlo de los estudiantes
export const deleteCourse = async (req, res) => {
    try {
        const { courseName } = req.body;

        if (!courseName) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el nombre del curso a eliminar."
            });
        }

        await User.updateMany(
            { cursos: courseName },
            { $pull: { cursos: courseName } }
        );

        return res.status(200).json({
            success: true,
            message: "Curso eliminado correctamente y desasignado de los estudiantes."
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el curso",
            error: err.message
        });
    }
};

