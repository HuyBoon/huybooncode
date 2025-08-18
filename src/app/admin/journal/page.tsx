import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { dbConnect } from "@/libs/dbConnection";

import Journal from "@/models/Journal";
import JournalPageClient from "./JournalPageClient";
import { JournalType, MoodType } from "@/types/interface";
import Loader from "@/components/admin/Loader";

const moods: MoodType[] = [
	{ id: "1", name: "Happy", emoji: "😊" },
	{ id: "2", name: "Sad", emoji: "😢" },
	{ id: "3", name: "Excited", emoji: "🎉" },
	{ id: "4", name: "Calm", emoji: "😌" },
];

export default async function JournalPage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}

	try {
		await dbConnect();
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const journals = await Journal.find({
			date: {
				$gte: today,
				$lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
			},
		}).sort({ date: -1 });

		const formattedJournals: JournalType[] = journals.map((journal) => ({
			id: journal._id.toString(),
			title: journal.title,
			content: journal.content,
			mood: journal.mood,
			date: journal.date.toISOString(),
			createdAt: journal.createdAt.toISOString(),
			updatedAt: journal.updatedAt.toISOString(),
		}));

		return (
			<JournalPageClient
				initialJournals={formattedJournals}
				initialMoods={moods}
				initialPagination={{
					page: 1,
					limit: 10,
					total: formattedJournals.length,
					totalPages: 1,
				}}
			/>
		);
	} catch (error: any) {
		console.error("Error in JournalPage:", error.message);
		return (
			<div>
				<Loader />
			</div>
		);
	}
}
