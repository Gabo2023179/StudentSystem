import { timeStamp } from "console";
import { Schema, model } from "mongoose";

const userSchema = Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },
    surname:{
        type: String,
        required: [true, "Surname is required"],
        maxLength: [25, "Surname cannot exceed 25 characters"]
    },
    username:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 8

    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    phone:{
        type: String,
        required: true,
        minLength: 8,
        maxLength: 8
    },
    cursos: {
        type: [String], // Un usuario puede tener varios cursos (máximo 3)
        validate: {
            validator: function (cursos) {
                return cursos.length <= 3; // Permite máximo 3 cursos
            },
            message: "Un usuario solo puede estar en un máximo de 3 cursos."
        }
    role:{
        type: String,
        required: true,
        enum: ["TEACHER_ROLE", "STUDENT_ROLE"]
    },
    status:{
        type: Boolean,
        default: true
    }

},
    {
    versionKey: false,
    timeStamps: true
    }
)

serSchema.methods.toJson = function(){
    const { password, _id, ...user } = this.toObject()
    user.uid = _id // uid = user identification
    return user
}
export default model("User", userSchema)