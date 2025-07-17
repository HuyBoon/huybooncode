import { NextResponse } from "next/server";
import FinanceCategory from "@/models/FinanceCategory";
import { dbConnect } from "@/libs/dbConnect";

interface FinanceCategory {
    id: string;
    name: string;
    type: "Income" | "Expense" | "Other";
    createdAt: string;
    updatedAt: string;
}

export async function GET() {
    await dbConnect();
    try {
        const categories: FinanceCategory[] = await FinanceCategory.find().sort({ type: 1, name: 1 });
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { name, type } = await request.json();
        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json({ error: "Category name is required and must be a non-empty string" }, { status: 400 });
        }
        if (!type || !["Income", "Expense", "Other"].includes(type)) {
            return NextResponse.json({ error: "Valid category type (Income, Expense, Other) is required" }, { status: 400 });
        }
        const category: FinanceCategory = await FinanceCategory.create({ name: name.trim(), type });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const { id, name, type } = await request.json();
        if (!id || !name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json({ error: "Valid category ID and name are required" }, { status: 400 });
        }
        if (!type || !["Income", "Expense", "Other"].includes(type)) {
            return NextResponse.json({ error: "Valid category type (Income, Expense, Other) is required" }, { status: 400 });
        }
        const category: FinanceCategory | null = await FinanceCategory.findByIdAndUpdate(
            id,
            { name: name.trim(), type },
            { new: true }
        );
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}


