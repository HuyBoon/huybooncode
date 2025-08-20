import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import JournalPageClient from "./JournalPageClient";
import { moods } from "@/utils/constant";
import { fetchJournals } from "@/utils/apiJournal";

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
				initialJournals={[]}
				initialMoods={moods}
				initialPagination={{ page: 1, limit: 10, total: 0, totalPages: 1 }}
				initialError={errorMessage}
			/>
		);
	}
}
