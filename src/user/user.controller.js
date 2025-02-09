import { hash, verify } from "argon2";
import User from "./user.model.js";

export const getUserById = async(req, res) => {
    try {
        const { uid } = res.params
        const user = await user.findById(uid)

        if(!User){
            return res.status(404).json({
                success: false,
                message: "El usuario no existe",
                error: err.message
            })
        }
        return res.status(200)({
            success: true,
            user
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obteneral usuario",
            error: err.message
        })
    }
}

export const getUsers = async(req, res) => {
    try {
        const { limits = 3, from = 0} = req.query
        const query = {status: true}

        const { total, users } = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(from))
                .limit(Number(limits))

        ])

        return req.status(200).json({
            success: true,
            total,
            users
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al listar los usuarios",
            error: err.message
        })
    }
}

// Registro de usuario
export const registerUser = async (req, res) => {
    try {
        const { name, surname, username, password, email, phone, role = "STUDENT_ROLE" } = req.body;
        const hashedPassword = await hash(password);

        const newUser = new User({
            name,
            surname,
            username,
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
        const { courseId } = req.body;

        const user = await User.findById(uid);
        if (user.role !== "STUDENT_ROLE") {
            return res.status(400).json({
                success: false,
                message: "Solo los estudiantes pueden asignarse a cursos"
            });
        }

        if (user.cursos.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: "El estudiante ya está asignado a este curso"
            });
        }

        if (user.cursos.length >= 3) {
            return res.status(400).json({
                success: false,
                message: "Un estudiante no puede estar asignado a más de 3 cursos"
            });
        }

        user.cursos.push(courseId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Curso asignado exitosamente",
            user
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
        const user = await User.findById(uid).populate('cursos');

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

        const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true });

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

// Crear curso (para maestros)
export const createCourse = async (req, res) => {
    try {
        const { uid } = req.params;
        const { name } = req.body;

        const user = await User.findById(uid);
        if (user.role !== "TEACHER_ROLE") {
            return res.status(400).json({
                success: false,
                message: "Solo los maestros pueden crear cursos"
            });
        }

        const newCourse = new Course({
            name,
            teacher: uid
        });

        await newCourse.save();

        return res.status(201).json({
            success: true,
            message: "Curso creado exitosamente",
            course: newCourse
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al crear el curso",
            error: err.message
        });
    }
};

// Editar curso (para maestros)
export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { name } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(courseId, { name }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Curso actualizado exitosamente",
            course: updatedCourse
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el curso",
            error: err.message
        });
    }
};

// Eliminar curso (para maestros)
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findByIdAndDelete(courseId);

        // Desasignar el curso de los estudiantes
        await User.updateMany(
            { cursos: courseId },
            { $pull: { cursos: courseId } }
        );

        return res.status(200).json({
            success: true,
            message: "Curso eliminado exitosamente"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el curso",
            error: err.message
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { uid } = req.params
        const { newPassword } = req.body

        const user = await User.findById(uid)

        const matchPassword = await verify(user.password, newPassword)

        if(matchPassword){
            return res.status(400).json({
                success: false,
                message: "La nueva contrasena no puede ser igual a la anterior"
            })
        }
        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(uid, {password: encryptedPassword})

        return res.status(200).json({
            success: true,
            message: "Contrasena actualizada"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar password",
            error: err.message
        }) 
    }
}