import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Finance from "@/models/Finance";
import { FinanceType } from "@/types/interface";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid finance ID" }, { status: 400 });
        }

        const finance = await Finance.findById(id).populate("category", "name type");
        if (!finance) {
            return NextResponse.json({ error: "Finance not found" }, { status: 404 });
        }

        const formattedFinance: FinanceType = {
            id: finance._id.toString(),
            type: finance.type,
            amount: finance.amount,
            category: finance.category._id.toString(),
            description: finance.description,
            date: finance.date.toISOString(),
            createdAt: finance.createdAt.toISOString(),
            updatedAt: finance.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedFinance, { status: 200 });
    } catch (error) {
        console.error("Error fetching finance:", error);
        return NextResponse.json(
            { error: "Failed to fetch finance" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid finance ID" }, { status: 400 });
        }

        const { type, amount, category, description, date } = await req.json();

        // Validate inputs
        if (!type || !["income", "expense", "saving", "investment", "debt", "loan", "other"].includes(type)) {
            return NextResponse.json(
                { error: "Valid type (income, expense) is required" },
                { status: 400 }
            );
        }
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return NextResponse.json(
                { error: "Valid amount (positive number) is required" },
                { status: 400 }
            );
        }
        if (!category || !mongoose.Types.ObjectId.isValid(category)) {
            return NextResponse.json(
                { error: "Valid category ID is required" },
                { status: 400 }
            );
        }
        if (!date || isNaN(new Date(date).getTime())) {
            return NextResponse.json(
                { error: "Valid date is required" },
                { status: 400 }
            );
        }

        const finance = await Finance.findByIdAndUpdate(
            id,
            {
                type,
                amount,
                category,
                description: description?.trim(),
                date: new Date(date),
            },
            { new: true }
        ).populate("category", "name type");

        if (!finance) {
            return NextResponse.json({ error: "Finance not found" }, { status: 404 });
        }

        const formattedFinance: FinanceType = {
            id: finance._id.toString(),
            type: finance.type,
            amount: finance.amount,
            category: finance.category._id.toString(),
            description: finance.description,
            date: finance.date.toISOString(),
            createdAt: finance.createdAt.toISOString(),
            updatedAt: finance.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedFinance, { status: 200 });
    } catch (error: any) {
        console.error("Error updating finance:", error);
        return NextResponse.json(
            { error: "Failed to update finance", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid finance ID" }, { status: 400 });
        }

        const finance = await Finance.findByIdAndDelete(id);
        if (!finance) {
            return NextResponse.json({ error: "Finance not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Finance deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting finance:", error);
        return NextResponse.json(
            { error: "Failed to delete finance" },
            { status: 500 }
        );
    }
}