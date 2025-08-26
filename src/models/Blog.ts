import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        description: { type: String, trim: true, default: "" },
        introductions: { type: String, trim: true, default: "" },
        blogcategory: { type: Schema.Types.ObjectId, ref: "BlogCategory", required: true },
        thumbnail: { type: String, trim: true, default: "" },
        content: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
        tags: { type: [String], default: [] },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);