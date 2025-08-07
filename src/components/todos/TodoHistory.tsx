"use client";

import React, { forwardRef } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Checkbox,
	Typography,
	Box,
	TablePagination,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	TextField,
	SelectChangeEvent,
} from "@mui/material";
import { Edit, Delete } from "lucide-react";
import {
	TodoType,
	StatusType,
	CategoryType,
	PaginationType,
	TodoFilters,
	SummaryToDoFilters,
} from "@/types/interface";

interface TodoHistoryProps {
	todos: TodoType[];
	statuses: StatusType[];
	categories: CategoryType[];
	loading: boolean;
	handleEdit: (todo: TodoType) => void;
	handleDelete: (id: string) => void;
	handleComplete: (id: string) => void;
	pagination: PaginationType;
	setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
	todoFilters: TodoFilters;
	setTodoFilters: React.Dispatch<React.SetStateAction<TodoFilters>>;
	summaryFilters: SummaryToDoFilters;
	setSummaryFilters: React.Dispatch<React.SetStateAction<SummaryToDoFilters>>;
}

const TodoHistory = forwardRef<{ todos: TodoType[] }, TodoHistoryProps>(
	(
		{
			todos,
			statuses,
			categories,
			loading,
			handleEdit,
			handleDelete,
			handleComplete,
			pagination,
			setPagination,
			todoFilters,
			setTodoFilters,
			summaryFilters,
			setSummaryFilters,
		},
		ref
	) => {
		React.useImperativeHandle(ref, () => ({
			todos,
		}));

		const handleChangePage = (
			event: React.MouseEvent<HTMLButtonElement> | null,
			newPage: number
		) => {
			setPagination((prev) => ({ ...prev, page: newPage + 1 }));
		};

		const handleSelectChange = (e: SelectChangeEvent<string>) => {
			const { name, value } = e.target;
			if (name) {
				setTodoFilters((prev) => ({
					...prev,
					[name as keyof TodoFilters]: value,
				}));
				setPagination((prev) => ({ ...prev, page: 1 }));
			}
		};

		const handleChangeRowsPerPage = (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			setPagination((prev) => ({
				...prev,
				limit: parseInt(event.target.value, 10),
				page: 1,
			}));
		};

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			if (name) {
				setTodoFilters((prev) => ({
					...prev,
					[name as keyof TodoFilters]: value,
				}));
				setPagination((prev) => ({ ...prev, page: 1 }));
			}
		};

		const getStatusName = (statusName: string) =>
			statuses.find((s) => s.name === statusName)?.name || "Unknown";
		const getStatusIcon = (statusName: string) =>
			statuses.find((s) => s.name === statusName)?.icon || "";
		const getCategoryName = (categoryId: string) =>
			categories.find((c) => c.id === categoryId)?.name || "Unknown";
		const isCompleted = (statusName: string) => statusName === "Completed";

		return (
			<Box sx={{ mt: 4 }}>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Todo History
				</Typography>
				<Grid container spacing={2} sx={{ mb: 2 }}>
					<Grid size={{ xs: 12, sm: 3 }}>
						<FormControl fullWidth>
							<InputLabel>Status</InputLabel>
							<Select
								name="status"
								value={todoFilters.status}
								onChange={handleSelectChange}
								label="Status"
								disabled={loading}
							>
								<MenuItem value="all">All</MenuItem>
								{statuses.map((status) => (
									<MenuItem key={status.id} value={status.name}>
										{status.icon} {status.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, sm: 3 }}>
						<FormControl fullWidth>
							<InputLabel>Priority</InputLabel>
							<Select
								name="priority"
								value={todoFilters.priority}
								onChange={handleSelectChange}
								label="Priority"
								disabled={loading}
							>
								<MenuItem value="all">All</MenuItem>
								<MenuItem value="low">Low</MenuItem>
								<MenuItem value="medium">Medium</MenuItem>
								<MenuItem value="high">High</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, sm: 3 }}>
						<FormControl fullWidth>
							<InputLabel>Category</InputLabel>
							<Select
								name="category"
								value={todoFilters.category}
								onChange={handleSelectChange}
								label="Category"
								disabled={loading}
							>
								<MenuItem value="all">All</MenuItem>
								{categories.map((category) => (
									<MenuItem key={category.id} value={category.id}>
										{category.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, sm: 3 }}>
						<FormControl fullWidth>
							<TextField
								label="Due Date (YYYY-MM)"
								name="dueDate"
								value={todoFilters.dueDate}
								onChange={handleInputChange}
								disabled={loading}
								type="month"
								InputLabelProps={{ shrink: true }}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Completed</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Priority</TableCell>
							<TableCell>Category</TableCell>
							<TableCell>Due Date</TableCell>
							<TableCell>Notify</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{todos.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} align="center">
									No todos found
								</TableCell>
							</TableRow>
						) : (
							todos.map((todo) => (
								<TableRow key={todo.id}>
									<TableCell>
										<Checkbox
											checked={isCompleted(todo.status)}
											onChange={() => handleComplete(todo.id)}
											disabled={loading || isCompleted(todo.status)}
											aria-label={`Mark ${todo.title} as completed`}
										/>
									</TableCell>
									<TableCell>{todo.title}</TableCell>
									<TableCell>
										{getStatusIcon(todo.status)} {getStatusName(todo.status)}
									</TableCell>
									<TableCell>{todo.priority}</TableCell>
									<TableCell>{getCategoryName(todo.category)}</TableCell>
									<TableCell>
										{new Date(todo.dueDate).toLocaleString("en-US", {
											year: "numeric",
											month: "2-digit",
											day: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</TableCell>
									<TableCell>
										{todo.notifyEnabled
											? `${todo.notifyMinutesBefore} min`
											: "Off"}
									</TableCell>
									<TableCell align="left">
										<IconButton
											onClick={() => handleEdit(todo)}
											disabled={loading}
											aria-label={`Edit ${todo.title}`}
										>
											<Edit size={16} />
										</IconButton>
										<IconButton
											onClick={() => handleDelete(todo.id)}
											disabled={loading}
											aria-label={`Delete ${todo.title}`}
										>
											<Delete size={16} color="red" />
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={pagination.total}
					rowsPerPage={pagination.limit}
					page={pagination.page - 1}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Box>
		);
	}
);

export default TodoHistory;
