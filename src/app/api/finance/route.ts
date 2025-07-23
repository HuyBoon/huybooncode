import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Finance from "@/models/Finance";
import { FinanceType } from "@/types/interface";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const today = searchParams.get("today") === "true";
        const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : null;
        const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null;
        const type = searchParams.get("type") || null;
        const category = searchParams.get("category") || null;
        const dayOfWeek = searchParams.get("dayOfWeek") ? parseInt(searchParams.get("dayOfWeek")!) : null;

        // Build query
        const query: any = {};
        if (today) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            query.date = {
                $gte: startOfDay,
                $lte: endOfDay,
            };
        } else if (month && year) {
            query.date = {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            };
        } else if (year) {
            query.date = {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1),
            };
        }
        if (type && ["income", "expense", "saving", "investment", "debt", "loan", "other"].includes(type)) {
            query.type = type;
        }
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.category = category;
        }
        if (dayOfWeek !== null && Number.isInteger(dayOfWeek) && dayOfWeek >= 0 && dayOfWeek <= 6) {
            query.date = query.date || {};
            query.date.$expr = {
                $eq: [{ $dayOfWeek: "$date" }, dayOfWeek + 1], // MongoDB $dayOfWeek: 1=Sunday, 7=Saturday
            };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const total = await Finance.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Fetch finances
        const finances = await Finance.find(query)
            .populate("category", "name type")
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

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

        return NextResponse.json(
            {
                data: formattedFinances,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            },
            { status: 200 }
        );
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
        if (!type || !["income", "expense", "saving", "investment", "debt", "loan", "other"].includes(type)) {
            return NextResponse.json(
                { error: "Valid type (income, expense, saving, investment, debt, loan, other) is required" },
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