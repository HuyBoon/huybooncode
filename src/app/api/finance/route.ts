import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Finance from "@/models/Finance";
import "@/models/FinanceCategory";
import { FinanceType } from "@/types/interface";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const period = searchParams.get("period") || "today";
        const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : null;
        const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null;
        const type = searchParams.get("type") || null;
        const category = searchParams.get("category") || null;
        const dayOfWeek = searchParams.get("dayOfWeek") ? parseInt(searchParams.get("dayOfWeek")!) : null;


        const query: any = {};
        const today = new Date();

        if (period === "today") {
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        } else if (period === "yesterday") {

            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            const endOfYesterday = new Date(yesterday);
            endOfYesterday.setHours(23, 59, 59, 999);
            query.date = { $gte: yesterday, $lte: endOfYesterday };
        } else if (period === "week") {
            const today = new Date();
            const day = today.getDay() === 0 ? 7 : today.getDay();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - day + 1);
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfWeek, $lte: endOfWeek };
        } else if (period === "month" && month && year) {
            query.date = {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            };
        } else if (period === "year" && year) {
            query.date = {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1),
            };
        }

        if (type && type !== "all" && ["income", "expense", "saving", "investment", "debt", "loan", "other"].includes(type)) {
            query.type = type;
        }
        if (category && category !== "all" && mongoose.Types.ObjectId.isValid(category)) {
            query.category = category;
        }
        if (dayOfWeek !== null && Number.isInteger(dayOfWeek) && dayOfWeek >= 0 && dayOfWeek <= 6) {
            query["$expr"] = {
                $eq: [{ $dayOfWeek: "$date" }, dayOfWeek + 1],
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

        return NextResponse.json({
            finances: formattedFinances,
            page,
            limit,
            total,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching finances:", error);
        return NextResponse.json({ error: "Failed to fetch finances" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { type, amount, category, description, date } = await request.json();

        if (!type || !["income", "expense", "saving", "investment", "debt", "loan", "other"].includes(type)) {
            return NextResponse.json({ error: "Valid type is required" }, { status: 400 });
        }
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return NextResponse.json({ error: "Valid positive amount is required" }, { status: 400 });
        }
        if (!category || !mongoose.Types.ObjectId.isValid(category)) {
            return NextResponse.json({ error: "Valid category ID is required" }, { status: 400 });
        }
        if (!date || isNaN(new Date(date).getTime())) {
            return NextResponse.json({ error: "Valid date is required" }, { status: 400 });
        }

        const finance = await Finance.create({
            type,
            amount,
            category,
            description: description?.trim(),
            date: new Date(date),
        });

        const populatedFinance = await Finance.findById(finance._id).populate("category", "name type");

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
        return NextResponse.json({ error: "Failed to create finance", details: error.message }, { status: 500 });
    }
}