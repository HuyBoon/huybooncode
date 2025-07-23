import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Blog from "@/models/Blog";
import BlogCategory from "@/models/BlogCategory";
import mongoose from "mongoose";
import { BlogType } from "@/types/interface";

export async function GET(req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await context.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Valid blog ID is required" }, { status: 400 });
        }

        const blog = await Blog.findById(id)
            .populate("blogcategory", "name")
            .populate("author", "name");
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        const formattedBlog: BlogType = {
            id: blog._id.toString(),
            title: blog.title,
            slug: blog.slug,
            description: blog.description || "",
            introductions: blog.introductions || "",
            blogcategory: blog.blogcategory._id.toString(),
            thumbnail: blog.thumbnail || "",
            content: blog.content,
            status: blog.status,
            tags: blog.tags,
            author: blog.author ? blog.author._id.toString() : undefined,
            views: blog.views,
            createdAt: blog.createdAt.toISOString(),
            updatedAt: blog.updatedAt.toISOString(),
        };

        await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });

        return NextResponse.json(formattedBlog, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching blog:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch blog", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {

        const { id } = await context.params;
        const {
            title,
            slug,
            description,
            introductions,
            blogcategory,
            thumbnail,
            content,
            status,
            tags,
            author,
        } = await req.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Valid blog ID is required" }, { status: 400 });
        }
        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
        }
        if (!slug || typeof slug !== "string" || !slug.trim()) {
            return NextResponse.json({ error: "Valid slug is required" }, { status: 400 });
        }
        if (!blogcategory || !mongoose.Types.ObjectId.isValid(blogcategory)) {
            return NextResponse.json({ error: "Valid category ID is required" }, { status: 400 });
        }
        if (!content || typeof content !== "string" || !content.trim()) {
            return NextResponse.json({ error: "Valid content is required" }, { status: 400 });
        }
        if (status && !["draft", "published", "archived"].includes(status)) {
            return NextResponse.json(
                { error: "Valid status (draft, published, archived) is required" },
                { status: 400 }
            );
        }
        if (author && !mongoose.Types.ObjectId.isValid(author)) {
            return NextResponse.json({ error: "Valid author ID is required" }, { status: 400 });
        }

        const categoryExists = await BlogCategory.findById(blogcategory);
        if (!categoryExists) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const blog = await Blog.findByIdAndUpdate(
            id,
            {
                title: title.trim(),
                slug: slug.trim(),
                description: description?.trim() || "",
                introductions: introductions?.trim() || "",
                blogcategory,
                thumbnail: thumbnail?.trim() || "",
                content: content.trim(),
                status: status || "draft",
                tags: tags || [],
                author: author || null,
            },
            { new: true, runValidators: true }
        )
            .populate("blogcategory", "name")
            .populate("author", "name");

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        const formattedBlog: BlogType = {
            id: blog._id.toString(),
            title: blog.title,
            slug: blog.slug,
            description: blog.description || "",
            introductions: blog.introductions || "",
            blogcategory: blog.blogcategory._id.toString(),
            thumbnail: blog.thumbnail || "",
            content: blog.content,
            status: blog.status,
            tags: blog.tags,
            author: blog.author ? blog.author._id.toString() : undefined,
            views: blog.views,
            createdAt: blog.createdAt.toISOString(),
            updatedAt: blog.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedBlog, { status: 200 });
    } catch (error: any) {
        console.error("Error updating blog:", error.message);
        return NextResponse.json(
            { error: "Failed to update blog", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Valid blog ID is required" }, { status: 400 });
        }

        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting blog:", error.message);
        return NextResponse.json(
            { error: "Failed to delete blog", details: error.message },
            { status: 500 }
        );
    }
}