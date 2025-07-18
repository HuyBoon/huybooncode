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
        const categories = await FinanceCategory.find().sort({ type: 1, name: 1 });
        const formattedCategories: FinanceCategory[] = categories.map((cat) => ({
            id: cat._id.toString(),
            name: cat.name,
            type: cat.type,
            createdAt: cat.createdAt.toISOString(),
            updatedAt: cat.updatedAt.toISOString(),
        }));
        return NextResponse.json(formattedCategories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { name, type } = await request.json();
        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { error: "Category name is required and must be a non-empty string" },
                { status: 400 }
            );
        }
        if (!type || !["Income", "Expense", "Other"].includes(type)) {
            return NextResponse.json(
                { error: "Valid category type (Income, Expense, Other) is required" },
                { status: 400 }
            );
        }
        const category = await FinanceCategory.create({ name: name.trim(), type });
        const formattedCategory: FinanceCategory = {
            id: category._id.toString(),
            name: category.name,
            type: category.type,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
        };
        return NextResponse.json(formattedCategory, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Category name must be unique" },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const { id, name, type } = await request.json();
        if (!id || !name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { error: "Valid category ID and name are required" },
                { status: 400 }
            );
        }
        if (!type || !["Income", "Expense", "Other"].includes(type)) {
            return NextResponse.json(
                { error: "Valid category type (Income, Expense, Other) is required" },
                { status: 400 }
            );
        }
        const category = await FinanceCategory.findByIdAndUpdate(
            id,
            { name: name.trim(), type },
            { new: true }
        );
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        const formattedCategory: FinanceCategory = {
            id: category._id.toString(),
            name: category.name,
            type: category.type,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
        };
        return NextResponse.json(formattedCategory, { status: 200 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Category name must be unique" },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    await dbConnect();
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        }
        const category = await FinanceCategory.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Category deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}

