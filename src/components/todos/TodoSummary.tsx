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
import { TodoType } from "@/types/interface";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface TodoSummaryProps {
	todos: TodoType[];
}

const TodoSummary: React.FC<TodoSummaryProps> = ({ todos }) => {
	const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
		"month"
	);
	const [chartType, setChartType] = useState<"status" | "priority">("status");

	// Filter todos based on time range
	const filteredTodos = useMemo(() => {
		const now = new Date();
		const startDate = new Date();

		if (timeRange === "week") {
			startDate.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
		} else if (timeRange === "month") {
			startDate.setDate(1); // Start of current month
		} else if (timeRange === "year") {
			startDate.setMonth(0, 1); // Start of current year
		}

		return todos.filter((todo) => {
			const todoDate = new Date(todo.dueDate);
			return todoDate >= startDate && todoDate <= now;
		});
	}, [todos, timeRange]);

	// Calculate status and priority counts
	const counts = useMemo(() => {
		const statusCounts: { [key: string]: number } = {
			pending: 0,
			completed: 0,
		};
		const priorityCounts: { [key: string]: number } = {
			low: 0,
			medium: 0,
			high: 0,
		};
		filteredTodos.forEach((todo) => {
			statusCounts[todo.status] = (statusCounts[todo.status] || 0) + 1;
			priorityCounts[todo.priority] = (priorityCounts[todo.priority] || 0) + 1;
		});
		return { statusCounts, priorityCounts };
	}, [filteredTodos]);

	// Chart data
	const chartData = useMemo(() => {
		const labels =
			chartType === "status"
				? ["Pending", "Completed"]
				: ["Low", "Medium", "High"];
		const data =
			chartType === "status"
				? [counts.statusCounts.pending, counts.statusCounts.completed]
				: [
						counts.priorityCounts.low,
						counts.priorityCounts.medium,
						counts.priorityCounts.high,
				  ];
		return {
			labels,
			datasets: [
				{
					label:
						chartType === "status"
							? "Task Count by Status"
							: "Task Count by Priority",
					data,
					backgroundColor:
						chartType === "status"
							? ["#f44336", "#4caf50"]
							: ["#2196f3", "#ff9800", "#f44336"],
					borderColor:
						chartType === "status"
							? ["#d32f2f", "#388e3c"]
							: ["#1976d2", "#f57c00", "#d32f2f"],
					borderWidth: 1,
				},
			],
		};
	}, [counts, chartType]);

	return (
		<Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Todo Summary
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 4 }}>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Time Range</InputLabel>
							<Select
								value={timeRange}
								onChange={(e) =>
									setTimeRange(e.target.value as "week" | "month" | "year")
								}
								label="Time Range"
								aria-label="Select time range"
							>
								<MenuItem value="week">Week</MenuItem>
								<MenuItem value="month">Month</MenuItem>
								<MenuItem value="year">Year</MenuItem>
							</Select>
						</FormControl>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Chart Type</InputLabel>
							<Select
								value={chartType}
								onChange={(e) =>
									setChartType(e.target.value as "status" | "priority")
								}
								label="Chart Type"
								aria-label="Select chart type"
							>
								<MenuItem value="status">Status</MenuItem>
								<MenuItem value="priority">Priority</MenuItem>
							</Select>
						</FormControl>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Total Tasks: {filteredTodos.length}
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Pending: {counts.statusCounts.pending}
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Completed: {counts.statusCounts.completed}
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Low Priority: {counts.priorityCounts.low}
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Medium Priority: {counts.priorityCounts.medium}
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							High Priority: {counts.priorityCounts.high}
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 4 }}>
						<Bar
							data={chartData}
							options={{
								responsive: true,
								plugins: {
									legend: { display: false },
									title: {
										display: true,
										text: `Task ${
											chartType === "status" ? "Status" : "Priority"
										} (${timeRange})`,
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

export default TodoSummary;
