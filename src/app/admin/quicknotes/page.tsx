import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import QuickNotePageClient from "@/components/quicknote/QuickNotePageClient";
import { getInitialQuickNotes } from "@/services/quicknote/quicknoteService";

export const dynamic = "force-dynamic";

export default async function QuickNotesPage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}

	const { initialQuickNotes, initialPagination, initialError } =
		await getInitialQuickNotes(10);

	return (
		<QuickNotePageClient
			initialQuickNotes={initialQuickNotes}
			initialPagination={initialPagination}
			initialError={initialError}
		/>
	);
}
