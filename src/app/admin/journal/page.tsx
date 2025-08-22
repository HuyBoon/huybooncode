import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import JournalPageClient from "./JournalPageClient";
import { moods } from "@/utils/constant";
import { fetchJournals } from "@/utils/apiJournal";
import { mockJournals, mockPagination } from "@/constants/mockJournals";

export default async function JournalPage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}

	try {
		const journalData = await fetchJournals({
			page: 1,
			limit: 10,
			period: "today",
		});
		return (
			<JournalPageClient
				initialJournals={journalData.data}
				initialMoods={moods}
				initialPagination={journalData.pagination}
				initialError={null}
			/>
		);
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to fetch journals";
		return (
			<JournalPageClient
				initialJournals={mockJournals}
				initialMoods={moods}
				initialPagination={mockPagination}
				initialError={errorMessage}
			/>
		);
	}
}
