import User from "../user/user.model.js";

export const existeEmail = async (email = '') => {
    try {
        const existe = await User.findOne({ email });
        if (existe) {
            throw new Error(`El email ${email} ya fue registrado previamente`);
        }
        return true;
    } catch (err) {
        throw new Error("Error verificando el email en la base de datos");
    }
};

export const existeUsername = async (username = '') => {
    try{
        const existe = await User.findOne({ username });
        if (existe) {
            throw new Error(`El username ${username} ya fue registrado previamente`);
        }
        return true;
    } catch (err) {
        throw new Error("Error verificando el username en la base de datos");
    }   
};

export const userExist = async (uid = '') => {
    try{
    const existe = await User.findById(uid);
    if (!existe) {
        throw new Error("El usuario no existe");
    }
    return true;
    } catch (err) {
    throw new Error("Error verificando el username en la base de datos");
    }   
};
