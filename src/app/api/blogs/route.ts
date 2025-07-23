import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import mongoose from "mongoose";
import { BlogType } from "@/types/interface";

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const category = searchParams.get("category") || null;
        const status = searchParams.get("status") || null;

        const query: any = {};
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.blogcategory = category;
        }
        if (status && ["draft", "published", "archived"].includes(status)) {
            query.status = status;
        }

        const skip = (page - 1) * limit;
        const total = await Blog.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const blogs = await Blog.find(query)
            .populate("blogcategory", "name")
            .populate("author", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const formattedBlogs: BlogType[] = blogs.map((blog) => ({
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
        }));

        return NextResponse.json(
            {
                data: formattedBlogs,
                pagination: { page, limit, total, totalPages },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching blogs:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch blogs", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
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
        } = await request.json();

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

        const categoryExists = await Category.findById(blogcategory);
        if (!categoryExists) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const blog = await Blog.create({
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
            views: 0,
        });

        const populatedBlog = await Blog.findById(blog._id)
            .populate("blogcategory", "name")
            .populate("author", "name");

        const formattedBlog: BlogType = {
            id: populatedBlog._id.toString(),
            title: populatedBlog.title,
            slug: populatedBlog.slug,
            description: populatedBlog.description || "",
            introductions: populatedBlog.introductions || "",
            blogcategory: populatedBlog.blogcategory._id.toString(),
            thumbnail: populatedBlog.thumbnail || "",
            content: populatedBlog.content,
            status: populatedBlog.status,
            tags: populatedBlog.tags,
            author: populatedBlog.author ? populatedBlog.author._id.toString() : undefined,
            views: populatedBlog.views,
            createdAt: populatedBlog.createdAt.toISOString(),
            updatedAt: populatedBlog.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedBlog, { status: 201 });
    } catch (error: any) {
        console.error("Error creating blog:", error.message);
        return NextResponse.json(
            { error: "Failed to create blog", details: error.message },
            { status: 500 }
        );
    }
}