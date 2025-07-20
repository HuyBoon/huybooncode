import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Journal from "@/models/Journal";
import { JournalType } from "@/types/interface";
import mongoose from "mongoose";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid journal ID" }, { status: 400 });
        }

        const { title, content, mood, date } = await req.json();

        // Validate inputs
        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
        }
        if (!content || typeof content !== "string" || !content.trim()) {
            return NextResponse.json({ error: "Valid content is required" }, { status: 400 });
        }
        if (!mood || typeof mood !== "string") {
            return NextResponse.json({ error: "Valid mood is required" }, { status: 400 });
        }
        if (!date || isNaN(new Date(date).getTime())) {
            return NextResponse.json({ error: "Valid date is required" }, { status: 400 });
        }

        const journal = await Journal.findByIdAndUpdate(
            id,
            {
                title: title.trim(),
                content: content.trim(),
                mood,
                date: new Date(date),
            },
            { new: true }
        );

        if (!journal) {
            return NextResponse.json({ error: "Journal not found" }, { status: 404 });
        }

        const formattedJournal: JournalType = {
            id: journal._id.toString(),
            title: journal.title,
            content: journal.content,
            mood: journal.mood,
            date: journal.date.toISOString(),
            createdAt: journal.createdAt.toISOString(),
            updatedAt: journal.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedJournal, { status: 200 });
    } catch (error: any) {
        console.error("Error updating journal:", error);
        return NextResponse.json(
            { error: "Failed to update journal", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid journal ID" }, { status: 400 });
        }

        const journal = await Journal.findByIdAndDelete(id);
        if (!journal) {
            return NextResponse.json({ error: "Journal not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Journal deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting journal:", error);
        return NextResponse.json({ error: "Failed to delete journal" }, { status: 500 });
    }
}