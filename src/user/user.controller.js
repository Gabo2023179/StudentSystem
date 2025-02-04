import { hash, verify} from "argon2"
import User from "./user.model.js"

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

export const deleteUser = async(req, res) => {
    try {
        const { uid } = req.params

        const user = await User.findByIdAndUpdate(uid, {status: false}, {new: true})

        return res.status(200).json({
            success: true,
            message: "Usuario Eliminado Exitosamente"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        })
    }
}

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