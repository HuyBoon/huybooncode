"use client";

import React from "react";
import { Box, Grid, Snackbar, Alert, Button, Typography } from "@mui/material";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/SnackbarContext";
import AddTodoForm from "./AddTodoForm";
import TodoSummary from "./TodoSummary";
import TodoHistory from "./TodoHistory";
import {
	TodoType,
	StatusType,
	CategoryType,
	PaginationType,
	TodoFilters,
} from "@/types/interface";

interface FormErrors {
	title?: string;
	status?: string;
	priority?: string;
	category?: string;
	dueDate?: string;
	description?: string;
	notifyMinutesBefore?: string;
}

interface TodoLayoutProps {
	categories: CategoryType[];
	statuses: StatusType[];
	todos: TodoType[];
	isLoading: boolean;
	pagination: PaginationType;
	todoFilters: TodoFilters;
	setTodoFilters: React.Dispatch<React.SetStateAction<TodoFilters>>;
	setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
	handleEdit: (todo: TodoType) => void;
	handleDelete: (id: string) => Promise<void>;
	handleComplete: (id: string) => Promise<void>;
	handleCancel: () => void;
	initialFormData?: TodoType;
	formData: {
		id: string | null;
		title: string;
		description: string;
		status: string;
		priority: "low" | "medium" | "high";
		category: string;
		dueDate: string;
		notifyEnabled: boolean;
		notifyMinutesBefore: number;
	};
	formErrors: FormErrors;
	handleFormChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| { target: { name?: string; value: unknown } }
	) => void;
	resetFilters: () => void; // Add resetFilters to interface
}

const TodoLayout: React.FC<TodoLayoutProps> = ({
	categories,
	statuses,
	todos,
	isLoading,
	pagination,
	todoFilters,
	setTodoFilters,
	setPagination,
	handleSubmit,
	handleEdit,
	handleDelete,
	handleComplete,
	handleCancel,
	initialFormData,
	formData,
	formErrors,
	handleFormChange,
	resetFilters, // Destructure resetFilters
}) => {
	const { snackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", mt: 2, minHeight: "100vh" }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Typography variant="h4" sx={{ fontWeight: 600 }}>
					Todo List
				</Typography>
				<Button
					variant="outlined"
					onClick={() => router.push("/admin/todolist/categories")}
					startIcon={<Settings size={20} />}
					sx={{ textTransform: "none", fontWeight: 500 }}
					aria-label="Manage categories"
				>
					Manage Categories
				</Button>
			</Box>
			<Grid container spacing={2}>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6 }}>
						<AddTodoForm
							categories={categories}
							statuses={statuses}
							loading={isLoading}
							onSubmit={handleSubmit}
							onCancel={handleCancel}
							initialData={
								initialFormData
									? {
											id: initialFormData.id,
											title: initialFormData.title,
											description: initialFormData.description || "",
											status: initialFormData.status,
											priority: initialFormData.priority,
											category: initialFormData.category,
											dueDate: new Date(initialFormData.dueDate)
												.toISOString()
												.split("T")[0],
											notifyEnabled: initialFormData.notifyEnabled,
											notifyMinutesBefore: initialFormData.notifyMinutesBefore,
									  }
									: undefined
							}
							formData={formData}
							formErrors={formErrors}
							handleChange={handleFormChange}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<TodoSummary
							todos={todos}
							statuses={statuses}
							todoFilters={todoFilters}
							setTodoFilters={setTodoFilters}
						/>
					</Grid>
				</Grid>
				<Grid size={{ xs: 12, md: 12 }}>
					<TodoHistory
						todos={todos}
						statuses={statuses}
						categories={categories}
						loading={isLoading}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						handleComplete={handleComplete}
						pagination={pagination}
						setPagination={setPagination}
						todoFilters={todoFilters}
						setTodoFilters={setTodoFilters}
						resetFilters={resetFilters} // Pass resetFilters to TodoHistory
					/>
				</Grid>
			</Grid>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={closeSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={closeSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default TodoLayout;
