import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Finance from "@/models/Finance";
import { FinanceType } from "@/types/interface";
import mongoose from "mongoose";

export async function GET() {
    await dbConnect();
    try {
        const finances = await Finance.find()
            .populate("category", "name type")
            .sort({ date: -1 });
        const formattedFinances: FinanceType[] = finances.map((fin) => ({
            id: fin._id.toString(),
            type: fin.type,
            amount: fin.amount,
            category: fin.category._id.toString(),
            description: fin.description,
            date: fin.date.toISOString(),
            createdAt: fin.createdAt.toISOString(),
            updatedAt: fin.updatedAt.toISOString(),
        }));
        return NextResponse.json(formattedFinances, { status: 200 });
    } catch (error) {
        console.error("Error fetching finances:", error);
        return NextResponse.json(
            { error: "Failed to fetch finances" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { type, amount, category, description, date } = await request.json();

        // Validate inputs
        if (!type || !["income", "expense"].includes(type)) {
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

        const finance = await Finance.create({
            type,
            amount,
            category,
            description: description?.trim(),
            date: new Date(date),
        });

        const populatedFinance = await Finance.findById(finance._id).populate(
            "category",
            "name type"
        );

        const formattedFinance: FinanceType = {
            id: populatedFinance._id.toString(),
            type: populatedFinance.type,
            amount: populatedFinance.amount,
            category: populatedFinance.category._id.toString(),
            description: populatedFinance.description,
            date: populatedFinance.date.toISOString(),
            createdAt: populatedFinance.createdAt.toISOString(),
            updatedAt: populatedFinance.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedFinance, { status: 201 });
    } catch (error: any) {
        console.error("Error creating finance:", error);
        return NextResponse.json(
            { error: "Failed to create finance", details: error.message },
            { status: 500 }
        );
    }
}