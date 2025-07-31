"use client";

import React, { forwardRef } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	Checkbox,
	Typography,
	Box,
	TablePagination,
	IconButton,
} from "@mui/material";
import { Edit, Delete } from "lucide-react";
import { TodoType, StatusType, CategoryType } from "@/types/interface";

interface TodoHistoryProps {
	todos: TodoType[];
	statuses: StatusType[];
	categories: CategoryType[];
	loading: boolean;
	handleEdit: (todo: TodoType) => void;
	handleDelete: (id: string) => void;
	handleComplete: (id: string, isCompleted: boolean) => void;
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	setPagination: React.Dispatch<
		React.SetStateAction<{
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		}>
	>;
	setFilters: React.Dispatch<
		React.SetStateAction<{
			dueDate: string;
			status: string;
			priority: string;
			category: string;
		}>
	>;
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
			// setFilters is not used in this component, but passed in props.
			// Consider removing it if it's not needed, or use it if it is.
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

		const handleChangeRowsPerPage = (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			setPagination((prev) => ({
				...prev,
				limit: parseInt(event.target.value, 10),
				page: 1, // Reset to first page when rows per page changes
			}));
		};

		const getStatusName = (statusId: string) =>
			statuses.find((s) => s.id === statusId)?.name || "Unknown";
		const getCategoryName = (categoryId: string) =>
			categories.find((c) => c.id === categoryId)?.name || "Unknown";
		const isCompleted = (statusId: string) =>
			statuses.find((s) => s.id === statusId)?.name.toLowerCase() ===
			"completed";

		return (
			<Box sx={{ mt: 4 }}>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Todo History
				</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Completed</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Priority</TableCell>
							<TableCell>Category</TableCell>
							<TableCell>Due Date</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{todos.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									No todos found
								</TableCell>
							</TableRow>
						) : (
							todos.map((todo) => (
								<TableRow key={todo.id}>
									<TableCell>
										<Checkbox
											checked={isCompleted(todo.status)}
											onChange={(e) =>
												handleComplete(todo.id, e.target.checked)
											}
											disabled={loading || isCompleted(todo.status)}
											aria-label={`Mark ${todo.title} as completed`}
										/>
									</TableCell>
									<TableCell>{todo.title}</TableCell>
									<TableCell>{getStatusName(todo.status)}</TableCell>
									<TableCell>{todo.priority}</TableCell>
									<TableCell>{getCategoryName(todo.category)}</TableCell>
									<TableCell>
										{new Date(todo.dueDate).toLocaleDateString()}
									</TableCell>
									{/* Adjusted className here */}
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
					page={pagination.page - 1} // MUI TablePagination is 0-indexed
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Box>
		);
	}
);

export default TodoHistory;
