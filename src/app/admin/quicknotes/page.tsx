import { QuickNoteType, PaginationType } from "@/types/interface";
import { dbConnect } from "@/libs/dbConnection";
import QuickNote from "@/models/QuickNote";
import QuickNotePageClient from "@/components/quicknote/QuickNotePageClient";

export default async function QuickNotesPage() {
	await dbConnect();
	let initialQuickNotes: QuickNoteType[] = [];
	let initialPagination: PaginationType = {
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 1,
	};
	let initialError: string | null = null;

	try {
		const quickNotes = await QuickNote.find().sort({ date: -1 }).limit(10);
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
			limit: 10,
			total,
			totalPages: Math.ceil(total / 10),
		};
	} catch (error: any) {
		console.error("Error fetching initial quick notes:", error);
		initialError = "Failed to connect to database";
		// Mock data fallback
		initialQuickNotes = [
			{
				id: "temp-1",
				content: "Sample quick note",
				date: new Date().toISOString(),
				category: "Work",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		];
	}

	return (
		<QuickNotePageClient
			initialQuickNotes={initialQuickNotes}
			initialPagination={initialPagination}
			initialError={initialError}
		/>
	);
}
