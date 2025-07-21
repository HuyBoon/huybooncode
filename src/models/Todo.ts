import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Status",
            required: [true, "Status is required"],
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            required: [true, "Priority is required"],
            default: "medium",
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
        },
    },
    { timestamps: true }
);

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);