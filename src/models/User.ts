import mongoose, { Schema, model, models } from 'mongoose';
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        default: "",
    },

    phone: {
        type: String,
        default: "",
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    isActive: {
        type: Boolean,
        default: false,
    },


    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
    }],

}, {
    timestamps: true,
});

export const User = models.User || model("User", UserSchema);
