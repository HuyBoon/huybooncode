import { NextResponse } from "next/server";

import FinanceCategory from "@/models/FinanceCategory";
import { dbConnect } from "@/libs/dbConnect";

export async function GET() {
    await dbConnect();
    try {
        const categories = await FinanceCategory.find().sort({ name: 1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { name } = await request.json();
        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }
        const category = await FinanceCategory.create({ name });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const { id, name } = await request.json();
        const category = await FinanceCategory.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    await dbConnect();
    try {
        const { id } = await request.json();
        const category = await FinanceCategory.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Category deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}