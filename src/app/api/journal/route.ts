import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Journal from "@/models/Journal";
import { JournalType } from "@/types/interface";

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const date = searchParams.get("date") || null;
        const mood = searchParams.get("mood") || null;

        // Build query
        const query: any = {};
        if (date) {
            const [year, month] = date.split("-").map(Number);
            query.date = {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            };
        }
        if (mood) {
            query.mood = mood;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const total = await Journal.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Fetch journals
        const journals = await Journal.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const formattedJournals: JournalType[] = journals.map((journal) => ({
            id: journal._id.toString(),
            title: journal.title,
            content: journal.content,
            mood: journal.mood,
            date: journal.date.toISOString(),
            createdAt: journal.createdAt.toISOString(),
            updatedAt: journal.updatedAt.toISOString(),
        }));

        return NextResponse.json(
            {
                data: formattedJournals,
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
        console.error("Error fetching journals:", error);
        return NextResponse.json({ error: "Failed to fetch journals" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { title, content, mood, date } = await request.json();

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

        const journal = await Journal.create({
            title: title.trim(),
            content: content.trim(),
            mood,
            date: new Date(date),
        });

        const formattedJournal: JournalType = {
            id: journal._id.toString(),
            title: journal.title,
            content: journal.content,
            mood: journal.mood,
            date: journal.date.toISOString(),
            createdAt: journal.createdAt.toISOString(),
            updatedAt: journal.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedJournal, { status: 201 });
    } catch (error: any) {
        console.error("Error creating journal:", error);
        return NextResponse.json(
            { error: "Failed to create journal", details: error.message },
            { status: 500 }
        );
    }
}