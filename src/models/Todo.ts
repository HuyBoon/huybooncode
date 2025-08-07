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
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
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
        notifyEnabled: {
            type: Boolean,
            default: true,
        },
        notifyMinutesBefore: {
            type: Number,
            default: 15,
            min: [0, "Notification time must be non-negative"],
        },
        notificationSent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

TodoSchema.index({ status: 1, dueDate: -1 });
TodoSchema.index({ category: 1 });
TodoSchema.index({ priority: 1 });
TodoSchema.index({ dueDate: 1 });
TodoSchema.index({ category: 1, dueDate: -1 });
TodoSchema.index({ dueDate: 1, notifyEnabled: 1, notificationSent: 1 });

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);