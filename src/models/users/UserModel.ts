import mongoose from "mongoose";
import UserRole from "./UserRole.js";

export interface UserSchema {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    location: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserSchema>(
    {
        name: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            default: "Last Nameson",
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            default: "Random City",
            required: true,
        },
        role: {
            enum: Object.values(UserRole),
            type: String,
            default: UserRole.USER,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
