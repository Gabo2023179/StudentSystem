import User from "../user/user.model.js"
import { hash, verify } from "argon2"
import { generateJWT } from "../helpers/generate-jwt.js"

export const register = async (req, res) => {
    try {
        const data = req.body
        let profilePicture = req.file ? req.file.filename : null
        const encryptedPassword = await hash(data.password)

        data.password = encryptedPassword
        data.profilePicture = profilePicture
        const user = await User.create(data)
        return res.status(201).json({
            message: "User has been registered",
            name: user.name,
            email: user.email
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            message: "User registration failed",
            error: err.message
        })
    }
}

export const login = async (req, res) => {
    const { email, username, password } = req.body
    try {
        const user = await User.findOne({
            $or:[{email: email}, {username: username}]
        })

        if(!user){
            return res.status(404).json({
                message: "Credenciales invalidas",
                error: "Username o email no existe en la base de datos"
            })
        }

        
        const validPassword = await verify(user.password, password)

        if(!validPassword){
            return res.status(400).json({
                message: "Credenciales invalidas",
                error: "Contrasena incorrecta"
            })
        }

        const token = await generateJWT(user.id, user.email)
        return res.status(200).json({
            message: "Inicio de secion exitoso",
            userDetails: {
             token,
             profilePicture: user.profilePicture
            }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error en inicio de secion",
            error: err.message
        })
    }
}