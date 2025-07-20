import mongoose, { Schema } from "mongoose";

const JournalSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        mood: { type: String, required: true },
        date: { type: Date, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Journal || mongoose.model("Journal", JournalSchema);