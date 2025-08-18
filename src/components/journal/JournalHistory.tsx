import React from "react";
import {
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { JournalType } from "@/types/interface";

interface JournalHistoryProps {
	journals: JournalType[];
	period: string;
	setPeriod: (period: string) => void;
}

const JournalHistory: React.FC<JournalHistoryProps> = ({
	journals,
	period,
	setPeriod,
}) => {
	const journalsByDay = journals.reduce((acc, journal) => {
		const date = new Date(journal.date).toLocaleDateString();
		acc[date] = (acc[date] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant="h6" gutterBottom>
				Journal History
			</Typography>
			<FormControl fullWidth sx={{ mb: 2 }}>
				<InputLabel>Period</InputLabel>
				<Select
					value={period}
					onChange={(e) => setPeriod(e.target.value)}
					label="Period"
				>
					<MenuItem value="today">Today</MenuItem>
					<MenuItem value="week">This Week</MenuItem>
					<MenuItem value="month">This Month</MenuItem>
					<MenuItem value="all">All Time</MenuItem>
				</Select>
			</FormControl>
			{Object.entries(journalsByDay).map(([date, count]) => (
				<Typography key={date}>
					{date}: {count} journal{count > 1 ? "s" : ""}
				</Typography>
			))}
			{Object.keys(journalsByDay).length === 0 && (
				<Typography>No journals found for this period</Typography>
			)}
		</Box>
	);
};

export default JournalHistory;
