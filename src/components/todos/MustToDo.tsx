"use client";

import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Checkbox,
	Typography,
	Card,
	useMediaQuery,
	useTheme,
	Box,
} from "@mui/material";

import { TodoType, StatusType, CategoryType } from "@/types/interface";

interface MustToDoProps {
	todos: TodoType[];
	statuses: StatusType[];
	categories: CategoryType[];
	loading: boolean;
	handleComplete: (id: string) => Promise<void>;
}

const MustToDo: React.FC<MustToDoProps> = ({
	todos,
	statuses,
	categories,
	loading,

	handleComplete,
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const getStatusName = (statusName: string) =>
		statuses.find((s) => s.name === statusName)?.name || "Unknown";
	const getStatusIcon = (statusName: string) =>
		statuses.find((s) => s.name === statusName)?.icon || "";
	const getCategoryName = (categoryId: string) =>
		categories.find((c) => c.id === categoryId)?.name || "Unknown";
	const isCompleted = (statusName: string) => statusName === "Completed";

	return (
		<Card
			sx={{
				borderRadius: "24px",
				overflow: "hidden",
				background: "linear-gradient(135deg, #5e35b1 0%, #4527a0 100%)",
				boxShadow: "none",
				p: { xs: 2, sm: 3 },
				display: "flex",
				flexDirection: "column",
				height: "100%",
				minHeight: { xs: "300px", sm: "350px", md: "400px" },
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
								</>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{todos.length === 0 ? (
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
							todos.map((todo) => (
								<TableRow key={todo.id}>
									<TableCell sx={{ p: { xs: 1, sm: 2 } }}>
										<Checkbox
											checked={isCompleted(todo.status)}
											onChange={() => handleComplete(todo.id)}
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
};

export default MustToDo;
