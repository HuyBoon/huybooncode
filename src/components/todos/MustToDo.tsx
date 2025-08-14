"use client";

import React, { forwardRef, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Checkbox,
	Typography,
	IconButton,
	Card,
} from "@mui/material";
import { Edit, Delete } from "lucide-react";
import { TodoType, StatusType, CategoryType } from "@/types/interface";

interface MustToDoProps {
	todos: TodoType[];
	statuses: StatusType[];
	categories: CategoryType[];
	loading: boolean;
	handleEdit: (todo: TodoType) => void;
	handleDelete: (id: string) => Promise<void>;
	handleComplete: (id: string) => Promise<void>;
}

const MustToDo = forwardRef<{ todos: TodoType[] }, MustToDoProps>(
	(
		{
			todos: initialTodos,
			statuses,
			categories,
			loading,
			handleEdit,
			handleDelete,
			handleComplete,
		},
		ref
	) => {
		const [localTodos, setLocalTodos] = useState<TodoType[]>(initialTodos);

		React.useImperativeHandle(ref, () => ({
			todos: localTodos,
		}));

		const getStatusName = (statusName: string) =>
			statuses.find((s) => s.name === statusName)?.name || "Unknown";
		const getStatusIcon = (statusName: string) =>
			statuses.find((s) => s.name === statusName)?.icon || "";
		const getCategoryName = (categoryId: string) =>
			categories.find((c) => c.id === categoryId)?.name || "Unknown";
		const isCompleted = (statusName: string) => statusName === "Completed";

		const handleOptimisticComplete = async (id: string) => {
			const completedStatus = statuses.find((s) => s.name === "Completed");
			if (!completedStatus) return;

			// Optimistically update local state
			setLocalTodos((prevTodos) =>
				prevTodos.map((todo) =>
					todo.id === id ? { ...todo, status: completedStatus.name } : todo
				)
			);

			try {
				await handleComplete(id);
			} catch (error) {
				// Revert on error
				setLocalTodos(initialTodos);
			}
		};

		return (
			<Card
				sx={{
					borderRadius: "24px",
					overflow: "hidden",
					background: "transparent",
					boxShadow: "none",
					p: 3,
				}}
			>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#fff" }}>
					Today's Must-Do Tasks
				</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 600, color: "#fff" }}>
								Completed
							</TableCell>
							<TableCell sx={{ fontWeight: 600, color: "#fff" }}>
								Title
							</TableCell>
							<TableCell sx={{ fontWeight: 600, color: "#fff" }}>
								Status
							</TableCell>
							<TableCell sx={{ fontWeight: 600, color: "#fff" }}>
								Category
							</TableCell>
							<TableCell sx={{ fontWeight: 600, color: "#fff" }}>
								Due Time
							</TableCell>
							<TableCell sx={{ fontWeight: 600, color: "#fff" }}>
								Actions
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{localTodos.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} align="center" sx={{ color: "#fff" }}>
									No tasks for today
								</TableCell>
							</TableRow>
						) : (
							localTodos.map((todo) => (
								<TableRow key={todo.id}>
									<TableCell>
										<Checkbox
											checked={isCompleted(todo.status)}
											onChange={() => handleOptimisticComplete(todo.id)}
											disabled={loading || isCompleted(todo.status)}
											sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
											aria-label={`Mark ${todo.title} as completed`}
										/>
									</TableCell>
									<TableCell sx={{ color: "#fff" }}>{todo.title}</TableCell>
									<TableCell sx={{ color: "#fff" }}>
										{getStatusIcon(todo.status)} {getStatusName(todo.status)}
									</TableCell>
									<TableCell sx={{ color: "#fff" }}>
										{getCategoryName(todo.category)}
									</TableCell>
									<TableCell sx={{ color: "#fff" }}>
										{new Date(todo.dueDate).toLocaleString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
											hour12: true,
										})}
									</TableCell>
									<TableCell align="left">
										<IconButton
											onClick={() => handleEdit(todo)}
											disabled={loading}
											aria-label={`Edit ${todo.title}`}
											sx={{ color: "#fff" }}
										>
											<Edit size={16} />
										</IconButton>
										<IconButton
											onClick={() => handleDelete(todo.id)}
											disabled={loading}
											aria-label={`Delete ${todo.title}`}
											sx={{ color: "#f44336" }}
										>
											<Delete size={16} />
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Card>
		);
	}
);

MustToDo.displayName = "MustToDo";

export default MustToDo;
