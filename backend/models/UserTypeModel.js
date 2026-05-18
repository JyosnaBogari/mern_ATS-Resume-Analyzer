import mongoose, { Schema, model } from 'mongoose'

//here we can select the user type i.e it may  user,author,admin
//define user schema with properties
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },

    lastName: {
        type: String
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    profileImageUrl: {
        type: String
    },

    isActive: {
        type: Boolean,
        default: true
    },

    // ADD THESE FOR GOOGLE LOGIN
    role: {
        type: String,
        default: "USER"
    },

    googleId: {
        type: String
    }

}, {
    timestamps: true,
    strict: "throw",
    versionKey: false
})

export const UserTypeModel =
    mongoose.models.user ||
    model("user", userSchema);