import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
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
        const period = searchParams.get("period") || null;
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
        if (mood && mood !== "all") {
            query.mood = mood;
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
        if (dateTimeStart && dateTimeEnd) {
            query.date = {
                $gte: new Date(dateTimeStart),
                $lte: new Date(dateTimeEnd),
            };
        }

        const skip = (page - 1) * limit;
        const total = await Journal.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

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
    } catch (error: any) {
        console.error("Error fetching journals:", error);
        return NextResponse.json(
            { error: "Failed to fetch journals", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();


    try {
        const { title, content, mood, date } = await request.json();

        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
        }
        const strippedContent = content.replace(/<[^>]+>/g, "").trim();
        if (!content || typeof content !== "string" || !strippedContent) {
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
            content: content,
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