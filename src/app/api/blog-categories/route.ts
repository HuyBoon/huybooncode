import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
import BlogCategory from "@/models/BlogCategory";
import { BlogCategoryType } from "@/types/interface";


export async function GET() {
    await dbConnect();
    try {
        const categories = await BlogCategory.find().sort({ name: 1 });
        const formattedCategories: BlogCategoryType[] = categories.map((cat) => ({
            id: cat._id.toString(),
            name: cat.name,

        }));
        return NextResponse.json({ data: formattedCategories }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching categories:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch categories", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { name } = await request.json();

        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json({ error: "Valid name is required" }, { status: 400 });
        }

        const category = await BlogCategory.create({ name: name.trim() });

        const formattedCategory: BlogCategoryType = {
            id: category._id.toString(),
            name: category.name,

        };

        return NextResponse.json(formattedCategory, { status: 201 });
    } catch (error: any) {
        console.error("Error creating category:", error.message);
        return NextResponse.json(
            { error: "Failed to create category", details: error.message },
            { status: 500 }
        );
    }
}