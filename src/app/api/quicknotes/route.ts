import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
import QuickNote from "@/models/QuickNote";
import { QuickNoteType } from "@/types/interface";

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const date = searchParams.get("date") || null;
        const period = searchParams.get("period") || null;
        const category = searchParams.get("category") || null;
        const dateTimeStart = searchParams.get("dateTimeRange[start]") || null;
        const dateTimeEnd = searchParams.get("dateTimeRange[end]") || null;

        const query: any = {};
        if (date) {
            const [year, month] = date.split("-").map(Number);
            query.date = {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            };
        }
        if (period && period !== "all") {
            const now = new Date();
            if (period === "today") {
                query.date = {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                };
            } else if (period === "week") {
                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                query.date = {
                    $gte: startOfWeek,
                    $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
                };
            } else if (period === "month") {
                query.date = {
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
                };
            }
        }
        if (category && category !== "all") {
            query.category = category;
        }
        if (dateTimeStart && dateTimeEnd) {
            query.date = {
                $gte: new Date(dateTimeStart),
                $lte: new Date(dateTimeEnd),
            };
        }

        const skip = (page - 1) * limit;
        const total = await QuickNote.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const quickNotes = await QuickNote.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const formattedQuickNotes: QuickNoteType[] = quickNotes.map((note) => ({
            id: note._id.toString(),
            content: note.content,
            date: note.date.toISOString(),
            category: note.category,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString(),
        }));

        return NextResponse.json(
            {
                data: formattedQuickNotes,
                pagination: { page, limit, total, totalPages },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching quick notes:", error);
        return NextResponse.json(
            { error: "Failed to fetch quick notes", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { content, date, category } = await request.json();

        if (!content || typeof content !== "string" || !content.trim()) {
            return NextResponse.json({ error: "Valid content is required" }, { status: 400 });
        }
        if (!date || isNaN(new Date(date).getTime())) {
            return NextResponse.json({ error: "Valid date is required" }, { status: 400 });
        }
        if (!category || !["Work", "Personal", "Ideas", "To-Do"].includes(category)) {
            return NextResponse.json({ error: "Valid category is required" }, { status: 400 });
        }

        const quickNote = await QuickNote.create({
            content: content.trim(),
            date: new Date(date),
            category,
        });

        const formattedQuickNote: QuickNoteType = {
            id: quickNote._id.toString(),
            content: quickNote.content,
            date: quickNote.date.toISOString(),
            category: quickNote.category,
            createdAt: quickNote.createdAt.toISOString(),
            updatedAt: quickNote.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedQuickNote, { status: 201 });
    } catch (error: any) {
        console.error("Error creating quick note:", error);
        return NextResponse.json(
            { error: "Failed to create quick note", details: error.message },
            { status: 500 }
        );
    }
}