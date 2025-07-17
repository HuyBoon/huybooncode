import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import Finance from "@/models/Finance";
import { dbConnect } from "@/libs/dbConnect";

export async function GET() {
    await dbConnect();
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const finances = await Finance.find({ userId: session.user.id })
            .populate("category", "name")
            .sort({ date: -1 });
        const formattedFinances = finances.map((f) => ({
            id: f._id.toString(),
            userId: f.userId,
            type: f.type,
            amount: f.amount,
            category: f.category._id.toString(),
            categoryName: f.category.name,
            description: f.description,
            date: f.date.toISOString(),
            createdAt: f.createdAt.toISOString(),
            updatedAt: f.updatedAt.toISOString(),
        }));
        return NextResponse.json(formattedFinances);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch finances" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { type, amount, category, description, date } = await request.json();
        const finance = await Finance.create({
            userId: session.user.id,
            type,
            amount,
            category,
            description,
            date: new Date(date),
        });
        const populatedFinance = await Finance.findById(finance._id).populate("category", "name");
        return NextResponse.json({
            id: populatedFinance._id.toString(),
            userId: populatedFinance.userId,
            type: populatedFinance.type,
            amount: populatedFinance.amount,
            category: populatedFinance.category._id.toString(),
            categoryName: populatedFinance.category.name,
            description: populatedFinance.description,
            date: populatedFinance.date.toISOString(),
            createdAt: populatedFinance.createdAt.toISOString(),
            updatedAt: populatedFinance.updatedAt.toISOString(),
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create finance" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, type, amount, category, description, date } = await request.json();
        const finance = await Finance.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { type, amount, category, description, date: new Date(date) },
            { new: true }
        ).populate("category", "name");
        if (!finance) {
            return NextResponse.json({ error: "Finance not found" }, { status: 404 });
        }
        return NextResponse.json({
            id: finance._id.toString(),
            userId: finance.userId,
            type: finance.type,
            amount: finance.amount,
            category: finance.category._id.toString(),
            categoryName: finance.category.name,
            description: finance.description,
            date: finance.date.toISOString(),
            createdAt: finance.createdAt.toISOString(),
            updatedAt: finance.updatedAt.toISOString(),
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update finance" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    await dbConnect();
    const session = await getServerSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await request.json();
        const finance = await Finance.findOneAndDelete({ _id: id, userId: session.user.id });
        if (!finance) {
            return NextResponse.json({ error: "Finance not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Finance deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete finance" }, { status: 500 });
    }
}