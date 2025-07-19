import { dbConnect } from "@/libs/dbConnect";
import FinanceCategory from "@/models/FinanceCategory";
import { FinanceCategoryType } from "@/types/interface";
import { NextRequest, NextResponse } from "next/server";

// GET /api/finance-categories/:id
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    await dbConnect();
    try {
        const category = await FinanceCategory.findById(id);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const formatted: FinanceCategoryType = {
            id: category._id.toString(),
            name: category.name,
            type: category.type,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
        };

        return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}

// PUT /api/finance-categories/:id
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await context.params;
    try {
        const { name, type } = await req.json();

        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { error: "Valid category name is required" },
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

        const formatted: FinanceCategoryType = {
            id: category._id.toString(),
            name: category.name,
            type: category.type,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
        };

        return NextResponse.json(formatted, { status: 200 });
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

// DELETE /api/finance-categories/:id
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    await dbConnect();
    try {
        const category = await FinanceCategory.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Category deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
