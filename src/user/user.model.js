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
        type: [String]
    },
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

userSchema.methods.toJson = function(){
    const { password, _id, ...user } = this.toObject()
    user.uid = _id // uid = user identification
    return user
}
export default model("User", userSchema)