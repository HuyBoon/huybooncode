import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
import BlogCategory from "@/models/BlogCategory";
import Blog from "@/models/Blog";
import { BlogCategoryType } from "@/types/interface";
import mongoose from "mongoose";

// Helper: Format document to API type
const formatCategory = (cat: any): BlogCategoryType => ({
    id: cat._id.toString(),
    name: cat.name,

});

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
        }

        const { name } = await req.json();
        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { error: "Category name is required and must be a non-empty string" },
                { status: 400 }
            );
        }

        const existingCategory = await BlogCategory.findOne({
            name: name.trim(),
            _id: { $ne: id },
        });
        if (existingCategory) {
            return NextResponse.json({ error: "Category name must be unique" }, { status: 400 });
        }

        const category = await BlogCategory.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true }
        );
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(formatCategory(category), { status: 200 });
    } catch (error: any) {
        console.error("PUT /blog-categories/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update category", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
        }

        // Check if category is used by any blogs
        const blogCount = await Blog.countDocuments({ blogcategory: id });
        if (blogCount > 0) {
            return NextResponse.json(
                { error: "Cannot delete category used by blogs" },
                { status: 400 }
            );
        }

        const category = await BlogCategory.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Category deleted" }, { status: 200 });
    } catch (error: any) {
        console.error("DELETE /blog-categories/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete category", details: error.message },
            { status: 500 }
        );
    }
}