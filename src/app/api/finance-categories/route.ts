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

export async function POST_seed(request: Request) {
    await dbConnect();
    try {
        const { categories } = await request.json();
        if (!Array.isArray(categories) || categories.length === 0) {
            return NextResponse.json(
                { error: "Categories array is required" },
                { status: 400 }
            );
        }
        for (const category of categories) {
            if (!category.name || typeof category.name !== "string" || !category.name.trim()) {
                return NextResponse.json(
                    { error: "Each category must have a valid name" },
                    { status: 400 }
                );
            }
            if (!category.type || !["Income", "Expense", "Other"].includes(category.type)) {
                return NextResponse.json(
                    { error: "Each category must have a valid type (Income, Expense, Other)" },
                    { status: 400 }
                );
            }
        }
        const existingCategories = await FinanceCategory.find({}, "name");
        const existingNames = new Set(existingCategories.map((cat) => cat.name));
        const categoriesToInsert = categories.filter(
            (cat: { name: string }) => !existingNames.has(cat.name)
        );

        if (categoriesToInsert.length === 0) {
            return NextResponse.json(
                { message: "No new categories to seed" },
                { status: 200 }
            );
        }

        const createdCategories = await FinanceCategory.insertMany(
            categoriesToInsert.map((cat: { name: string; type: "Income" | "Expense" | "Other" }) => ({
                name: cat.name.trim(),
                type: cat.type,
            }))
        );

        const formattedCategories: FinanceCategory[] = createdCategories.map((cat) => ({
            id: cat._id.toString(),
            name: cat.name,
            type: cat.type,
            createdAt: cat.createdAt.toISOString(),
            updatedAt: cat.updatedAt.toISOString(),
        }));
        return NextResponse.json(formattedCategories, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Some category names already exist" },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: "Failed to seed categories" }, { status: 500 });
    }
}