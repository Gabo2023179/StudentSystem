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