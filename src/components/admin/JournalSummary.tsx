"use client";

import React, { useState, useMemo } from "react";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { JournalType } from "@/types/interface";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface JournalSummaryProps {
	journals: JournalType[];
}

const JournalSummary: React.FC<JournalSummaryProps> = ({ journals }) => {
	const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
		"month"
	);

	const filteredJournals = useMemo(() => {
		const now = new Date();
		const startDate = new Date();

		if (timeRange === "week") {
			startDate.setDate(now.getDate() - now.getDay());
		} else if (timeRange === "month") {
			startDate.setDate(1);
		} else if (timeRange === "year") {
			startDate.setMonth(0, 1);
		}

		return journals.filter((journal) => {
			const journalDate = new Date(journal.date);
			return journalDate >= startDate && journalDate <= now;
		});
	}, [journals, timeRange]);

	const moodCounts = useMemo(() => {
		const counts: { [key: string]: number } = {};
		filteredJournals.forEach((journal) => {
			counts[journal.mood] = (counts[journal.mood] || 0) + 1;
		});
		return counts;
	}, [filteredJournals]);

	const chartData = useMemo(() => {
		const labels = Object.keys(moodCounts);
		const data = Object.values(moodCounts);
		return {
			labels,
			datasets: [
				{
					label: "Mood Count",
					data,
					backgroundColor: [
						"#4caf50",
						"#f44336",
						"#2196f3",
						"#ff9800",
						"#9c27b0",
					],
					borderColor: ["#388e3c", "#d32f2f", "#1976d2", "#f57c00", "#7b1fa2"],
					borderWidth: 1,
				},
			],
		};
	}, [moodCounts]);

	return (
		<Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Journal Summary
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, sm: 12, md: 4 }}>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Time Range</InputLabel>
							<Select
								value={timeRange}
								onChange={(e) =>
									setTimeRange(e.target.value as "week" | "month" | "year")
								}
								label="Time Range"
							>
								<MenuItem value="week">Week</MenuItem>
								<MenuItem value="month">Month</MenuItem>
								<MenuItem value="year">Year</MenuItem>
							</Select>
						</FormControl>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Total Entries: {filteredJournals.length}
						</Typography>
						{Object.entries(moodCounts).map(([mood, count]) => (
							<Typography key={mood} variant="body1" sx={{ fontWeight: 500 }}>
								{mood}: {count}
							</Typography>
						))}
					</Grid>

					<Grid size={{ xs: 12, sm: 12, md: 8 }}>
						<Bar
							data={chartData}
							options={{
								responsive: true,
								plugins: {
									legend: { display: false },
									title: {
										display: true,
										text: `Mood Distribution (${timeRange})`,
									},
								},
							}}
						/>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default JournalSummary;
