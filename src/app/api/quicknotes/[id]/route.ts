import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
import QuickNote from "@/models/QuickNote";
import { QuickNoteType } from "@/types/interface";
import mongoose from "mongoose";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid quick note ID" }, { status: 400 });
        }

        const quickNote = await QuickNote.findById(id);
        if (!quickNote) {
            return NextResponse.json({ error: "Quick note not found" }, { status: 404 });
        }

        const formattedQuickNote: QuickNoteType = {
            id: quickNote._id.toString(),
            content: quickNote.content,
            date: quickNote.date.toISOString(),
            category: quickNote.category,
            createdAt: quickNote.createdAt.toISOString(),
            updatedAt: quickNote.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedQuickNote, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching quick note:", error);
        return NextResponse.json(
            { error: "Failed to fetch quick note", details: error.message },
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
            return NextResponse.json({ error: "Invalid quick note ID" }, { status: 400 });
        }

        const { content, date, category } = await req.json();

        if (!content || typeof content !== "string" || !content.trim()) {
            return NextResponse.json({ error: "Valid content is required" }, { status: 400 });
        }
        if (!date || isNaN(new Date(date).getTime())) {
            return NextResponse.json({ error: "Valid date is required" }, { status: 400 });
        }
        if (!category || !["Work", "Personal", "Ideas", "To-Do"].includes(category)) {
            return NextResponse.json({ error: "Valid category is required" }, { status: 400 });
        }

        const quickNote = await QuickNote.findByIdAndUpdate(
            id,
            {
                content: content.trim(),
                date: new Date(date),
                category,
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!quickNote) {
            return NextResponse.json({ error: "Quick note not found" }, { status: 404 });
        }

        const formattedQuickNote: QuickNoteType = {
            id: quickNote._id.toString(),
            content: quickNote.content,
            date: quickNote.date.toISOString(),
            category: quickNote.category,
            createdAt: quickNote.createdAt.toISOString(),
            updatedAt: quickNote.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedQuickNote, { status: 200 });
    } catch (error: any) {
        console.error("Error updating quick note:", error);
        return NextResponse.json(
            { error: "Failed to update quick note", details: error.message },
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
            return NextResponse.json({ error: "Invalid quick note ID" }, { status: 400 });
        }

        const quickNote = await QuickNote.findByIdAndDelete(id);
        if (!quickNote) {
            return NextResponse.json({ error: "Quick note not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Quick note deleted" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting quick note:", error);
        return NextResponse.json(
            { error: "Failed to delete quick note", details: error.message },
            { status: 500 }
        );
    }
}