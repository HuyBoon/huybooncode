import { dbConnect } from "@/libs/dbConnection";
import QuickNote from "@/models/QuickNote";
import { QuickNoteType, PaginationType } from "@/types/interface";

export async function getInitialQuickNotes(limit = 10) {
    await dbConnect();

    let initialQuickNotes: QuickNoteType[] = [];
    let initialPagination: PaginationType = {
        page: 1,
        limit,
        total: 0,
        totalPages: 1,
    };

    try {
        const quickNotes = await QuickNote.find()
            .sort({ date: -1 })
            .limit(limit);

        const total = await QuickNote.countDocuments();

        initialQuickNotes = quickNotes.map((note) => ({
            id: note._id.toString(),
            content: note.content,
            date: note.date.toISOString(),
            category: note.category,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString(),
        }));

        initialPagination = {
            page: 1,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };

        return { initialQuickNotes, initialPagination, initialError: null };
    } catch (error: any) {
        console.error("Error fetching initial quick notes:", error);

        return {
            initialQuickNotes: [
                {
                    id: "temp-1",
                    content: "Sample quick note",
                    date: new Date().toISOString(),
                    category: "Work",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
            initialPagination,
            initialError: "Failed to connect to database",
        };
    }
}
