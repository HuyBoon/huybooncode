import React from "react";
import { Box, Typography } from "@mui/material";
import { JournalType } from "@/types/interface";

interface SummaryJournalProps {
	journals: JournalType[];
}

const SummaryJournal: React.FC<SummaryJournalProps> = ({ journals }) => {
	const journalsByDay = journals.reduce((acc, journal) => {
		const date = new Date(journal.date).toLocaleDateString();
		acc[date] = (acc[date] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant="h6">Journal Summary by Day</Typography>
			{Object.entries(journalsByDay).map(([date, count]) => (
				<Typography key={date}>
					{date}: {count} journal{count > 1 ? "s" : ""}
				</Typography>
			))}
			{Object.keys(journalsByDay).length === 0 && (
				<Typography>No journals found</Typography>
			)}
		</Box>
	);
};

export default SummaryJournal;
