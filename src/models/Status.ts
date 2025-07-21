import mongoose, { Schema } from "mongoose";

const statusSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        icon: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Status || mongoose.model("Status", statusSchema);