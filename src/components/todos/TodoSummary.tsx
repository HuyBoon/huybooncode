"use client";

import React from "react";
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
import { TodoType, StatusType, TodoFilters } from "@/types/interface";
import { SelectChangeEvent } from "@mui/material";

interface TodoSummaryProps {
	todos: TodoType[];
	statuses: StatusType[];
	todoFilters: TodoFilters;
	setTodoFilters: React.Dispatch<React.SetStateAction<TodoFilters>>;
}

const TodoSummary: React.FC<TodoSummaryProps> = ({
	todos,
	statuses,
	todoFilters,
	setTodoFilters,
}) => {
	const getStatusCount = (statusName: string) =>
		todos.filter((todo) => todo.status === statusName).length;

	const handleFilterChange = (e: SelectChangeEvent) => {
		const { name, value } = e.target;
		setTodoFilters((prev) => ({
			...prev,
			[name as keyof TodoFilters]: value,
		}));
	};

	return (
		<Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Todo Summary
				</Typography>
				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Period</InputLabel>
					<Select
						name="period"
						value={todoFilters.period || "today"}
						onChange={handleFilterChange}
						label="Period"
					>
						<MenuItem value="today">Today</MenuItem>
						<MenuItem value="week">This Week</MenuItem>
						<MenuItem value="month">This Month</MenuItem>
					</Select>
				</FormControl>
				<Grid container spacing={2}>
					{statuses.map((status) => (
						<Grid size={{ xs: 12, sm: 4 }} key={status.id}>
							<Typography variant="body1" sx={{ fontWeight: 500 }}>
								{status.icon} {status.name}
							</Typography>
							<Typography variant="h6">
								{getStatusCount(status.name)}
							</Typography>
						</Grid>
					))}
				</Grid>
			</CardContent>
		</Card>
	);
};

export default TodoSummary;
