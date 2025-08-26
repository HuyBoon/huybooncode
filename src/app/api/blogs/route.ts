import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
import Blog from "@/models/Blog";
import BlogCategory from "@/models/BlogCategory";
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
        const date = searchParams.get("date") || null;
        const period = searchParams.get("period") || null;

        const query: any = {};
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.blogcategory = category;
        }
        if (status && ["draft", "published", "archived"].includes(status)) {
            query.status = status;
        }
        if (date) {
            const [year, month] = date.split("-").map(Number);
            query.createdAt = {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            };
        }
        if (period && period !== "all") {
            const now = new Date();
            if (period === "today") {
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                query.createdAt = { $gte: startOfDay, $lt: endOfDay };
            } else if (period === "week") {
                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                query.createdAt = {
                    $gte: startOfWeek,
                    $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
                };
            } else if (period === "month") {
                query.createdAt = {
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
                };
            }
        }

        const skip = (page - 1) * limit;
        const total = await Blog.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const blogs = await Blog.find(query)
            .populate("blogcategory", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const formattedBlogs: BlogType[] = blogs.map((blog) => ({
            id: blog._id.toString(),
            title: blog.title,
            slug: blog.slug,
            description: blog.description || "",
            introductions: blog.introductions || "",
            blogcategory: blog.blogcategory?._id.toString() || "",
            thumbnail: blog.thumbnail || "",
            content: blog.content,
            status: blog.status,
            tags: blog.tags,
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

        const categoryExists = await BlogCategory.findById(blogcategory);
        if (!categoryExists) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const existingSlug = await Blog.findOne({ slug: slug.trim() });
        if (existingSlug) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
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
            views: 0,
        });

        const populatedBlog = await Blog.findById(blog._id).populate("blogcategory", "name");

        const formattedBlog: BlogType = {
            id: populatedBlog._id.toString(),
            title: populatedBlog.title,
            slug: populatedBlog.slug,
            description: populatedBlog.description || "",
            introductions: populatedBlog.introductions || "",
            blogcategory: populatedBlog.blogcategory?._id.toString() || "",
            thumbnail: populatedBlog.thumbnail || "",
            content: populatedBlog.content,
            status: populatedBlog.status,
            tags: populatedBlog.tags,
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