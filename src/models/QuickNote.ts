import mongoose, { Schema } from "mongoose";

const QuickNoteSchema = new Schema(
    {
        content: { type: String, required: true },
        date: { type: Date, required: true },
        category: { type: String, required: true, enum: ["Work", "Personal", "Ideas", "To-Do"] },
    },
    { timestamps: true }
);

QuickNoteSchema.index({ date: -1, category: 1 });

export default mongoose.models.QuickNote || mongoose.model("QuickNote", QuickNoteSchema);