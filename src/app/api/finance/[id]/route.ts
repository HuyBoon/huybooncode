import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
import Finance from "@/models/Finance";
import { FinanceType } from "@/types/interface";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";
import { Cacheable, CacheKeys, CacheInvalidator } from "@/libs/cache";

@Cacheable((id) => `finance:detail:${id}`, 300, ['finances'])
async function getFinance(id: string, userId: string) {
    const start = Date.now();
    const finance = await Finance.findOne({ _id: id, userId }).populate("category", "name type");
    console.log(`getFinance query took ${Date.now() - start}ms`);
    if (!finance) return null;
    return {
        id: finance._id.toString(),
        type: finance.type,
        amount: finance.amount,
        category: finance.category._id.toString(),
        description: finance.description,
        date: finance.date.toISOString(),
        createdAt: finance.createdAt.toISOString(),
        updatedAt: finance.updatedAt.toISOString(),
    };
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid finance ID" }, { status: 400 });
        }

        const finance = await getFinance(id, session.user.id);
        if (!finance) {
            return NextResponse.json({ error: "Finance not found" }, { status: 404 });
        }

        return NextResponse.json(finance, { status: 200 });
    } catch (error) {
        console.error("GET /finance/[id] error:", error);
        return NextResponse.json({ error: "Failed to fetch finance" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid finance ID" }, { status: 400 });
        }

        const { type, amount, category, description, date } = await req.json();

        if (!type || !["income", "expense", "saving", "investment", "debt", "loan", "other"].includes(type)) {
            return NextResponse.json(
                { error: "Valid type is required" },
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

        const finance = await Finance.findOneAndUpdate(
            { _id: id, userId: session.user.id },
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

        CacheInvalidator.invalidateByTag('finances');
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
        console.error("PUT /finance/[id] error:", error);
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
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid finance ID" }, { status: 400 });
        }

        const finance = await Finance.findOneAndDelete({ _id: id, userId: session.user.id });
        if (!finance) {
            return NextResponse.json({ error: "Finance not found" }, { status: 404 });
        }

        CacheInvalidator.invalidateByTag('finances');
        return NextResponse.json({ message: "Finance deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /finance/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete finance" }, { status: 500 });
    }
}