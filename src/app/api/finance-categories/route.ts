import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
import { FinanceCategoryType } from "@/types/interface";
import FinanceCategory from "@/models/FinanceCategory";

// Helper: Format document to API type
const formatCategory = (cat: any): FinanceCategoryType => ({
    id: cat._id.toString(),
    name: cat.name,
    type: cat.type,
    createdAt: cat.createdAt.toISOString(),
    updatedAt: cat.updatedAt.toISOString(),
});

// GET /api/finance-categories
export async function GET() {
    await dbConnect();
    try {
        const categories = await FinanceCategory.find().sort({ type: 1, name: 1 });
        const formatted = categories.map(formatCategory);
        return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
        console.error("GET /finance-categories error:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

// POST /api/finance-categories
export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { name, type } = body;

        // Validate input
        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { error: "Category name is required and must be a non-empty string" },
                { status: 400 }
            );
        }

        if (!["Income", "Expense", "Other"].includes(type)) {
            return NextResponse.json(
                { error: "Valid category type (Income, Expense, Other) is required" },
                { status: 400 }
            );
        }

        // Create new category
        const category = await FinanceCategory.create({
            name: name.trim(),
            type,
        });

        return NextResponse.json(formatCategory(category), { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Category name must be unique" },
                { status: 400 }
            );
        }
        console.error("POST /finance-categories error:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}