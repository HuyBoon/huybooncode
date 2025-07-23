import mongoose, { Schema } from "mongoose";

const BlogCategorySchema = new Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
    },
    { timestamps: true }
);

export default mongoose.models.BlogCategory || mongoose.model("BlogCategory", BlogCategorySchema);