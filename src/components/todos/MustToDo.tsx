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
	useMediaQuery,
	useTheme,
	Box,
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
		const theme = useTheme();
		const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
					overflowX: "hidden",
					background: "transparent",
					boxShadow: "none",
					p: { xs: 2, sm: 3 },
					display: "flex",
					flexDirection: "column",
					height: "100%",
					minHeight: { xs: "300px", sm: "350px", md: "400px" },
					maxHeight: "520px",
				}}
			>
				<Typography
					variant="h6"
					sx={{
						mb: 2,
						fontWeight: 600,
						color: "#fff",
						fontSize: { xs: "1.1rem", sm: "1.25rem" },
					}}
				>
					Today's Must-Do Tasks
				</Typography>
				<Box sx={{ flexGrow: 1, overflow: "auto" }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell
									sx={{
										fontWeight: 600,
										color: "#fff",
										p: { xs: 1, sm: 2 },
										fontSize: { xs: "0.8rem", sm: "1rem" },
									}}
								>
									Completed
								</TableCell>
								<TableCell
									sx={{
										fontWeight: 600,
										color: "#fff",
										p: { xs: 1, sm: 2 },
										fontSize: { xs: "0.8rem", sm: "1rem" },
									}}
								>
									Title
								</TableCell>
								<TableCell
									sx={{
										fontWeight: 600,
										color: "#fff",
										p: { xs: 1, sm: 2 },
										fontSize: { xs: "0.8rem", sm: "1rem" },
									}}
								>
									Status
								</TableCell>
								{!isMobile && (
									<>
										<TableCell
											sx={{
												fontWeight: 600,
												color: "#fff",
												p: { xs: 1, sm: 2 },
												fontSize: { xs: "0.8rem", sm: "1rem" },
											}}
										>
											Category
										</TableCell>
										<TableCell
											sx={{
												fontWeight: 600,
												color: "#fff",
												p: { xs: 1, sm: 2 },
												fontSize: { xs: "0.8rem", sm: "1rem" },
											}}
										>
											Due Time
										</TableCell>
										<TableCell
											sx={{
												fontWeight: 600,
												color: "#fff",
												p: { xs: 1, sm: 2 },
												fontSize: { xs: "0.8rem", sm: "1rem" },
											}}
										>
											Actions
										</TableCell>
									</>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{localTodos.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={isMobile ? 3 : 6}
										align="center"
										sx={{
											color: "#fff",
											p: { xs: 1, sm: 2 },
											fontSize: { xs: "0.8rem", sm: "1rem" },
										}}
									>
										No tasks for today
									</TableCell>
								</TableRow>
							) : (
								localTodos.map((todo) => (
									<TableRow key={todo.id}>
										<TableCell sx={{ p: { xs: 1, sm: 2 } }}>
											<Checkbox
												checked={isCompleted(todo.status)}
												onChange={() => handleOptimisticComplete(todo.id)}
												disabled={loading || isCompleted(todo.status)}
												sx={{
													color: "#fff",
													"&.Mui-checked": { color: "#fff" },
													transform: { xs: "scale(0.8)", sm: "scale(1)" },
												}}
												aria-label={`Mark ${todo.title} as completed`}
											/>
										</TableCell>
										<TableCell
											sx={{
												color: "#fff",
												p: { xs: 1, sm: 2 },
												fontSize: { xs: "0.8rem", sm: "1rem" },
											}}
										>
											{todo.title}
										</TableCell>
										<TableCell
											sx={{
												color: "#fff",
												p: { xs: 1, sm: 2 },
												fontSize: { xs: "0.8rem", sm: "1rem" },
											}}
										>
											{getStatusIcon(todo.status)} {getStatusName(todo.status)}
										</TableCell>
										{!isMobile && (
											<>
												<TableCell
													sx={{
														color: "#fff",
														p: { xs: 1, sm: 2 },
														fontSize: { xs: "0.8rem", sm: "1rem" },
													}}
												>
													{getCategoryName(todo.category)}
												</TableCell>
												<TableCell
													sx={{
														color: "#fff",
														p: { xs: 1, sm: 2 },
														fontSize: { xs: "0.8rem", sm: "1rem" },
													}}
												>
													{new Date(todo.dueDate).toLocaleString("en-US", {
														hour: "2-digit",
														minute: "2-digit",
														hour12: true,
													})}
												</TableCell>
												<TableCell sx={{ p: { xs: 1, sm: 2 } }} align="left">
													<IconButton
														onClick={() => handleEdit(todo)}
														disabled={loading}
														aria-label={`Edit ${todo.title}`}
														sx={{ color: "#fff" }}
													>
														<Edit size={isMobile ? 14 : 16} />
													</IconButton>
													<IconButton
														onClick={() => handleDelete(todo.id)}
														disabled={loading}
														aria-label={`Delete ${todo.title}`}
														sx={{ color: "#f44336" }}
													>
														<Delete size={isMobile ? 14 : 16} />
													</IconButton>
												</TableCell>
											</>
										)}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</Box>
			</Card>
		);
	}
);

export default MustToDo;
