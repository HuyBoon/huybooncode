import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Category from "@/models/Category";
import { CategoryType } from "@/types/interface";

// Helper: Format document to API type
const formatCategory = (cat: any): CategoryType => ({
    id: cat._id.toString(),
    name: cat.name,

});

export async function GET() {
    await dbConnect();
    try {
        const categories = await Category.find().sort({ name: 1 }).lean();
        const formattedCategories: CategoryType[] = categories.map(formatCategory);
        return NextResponse.json(formattedCategories, { status: 200 });
    } catch (error) {
        console.error("GET /categories error:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { name } = await req.json();

        // Validate input
        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { error: "Category name is required and must be a non-empty string" },
                { status: 400 }
            );
        }

        // Check for duplicate name
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return NextResponse.json(
                { error: "Category name must be unique" },
                { status: 400 }
            );
        }

        // Create new category
        const category = await Category.create({
            name: name.trim(),
        });

        return NextResponse.json(formatCategory(category), { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Category name must be unique" },
                { status: 400 }
            );
        }
        console.error("POST /categories error:", error);
        return NextResponse.json(
            { error: "Failed to create category", details: error.message },
            { status: 500 }
        );
    }
}