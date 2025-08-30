import React from "react";
import {
	Box,
	Grid,
	Snackbar,
	Alert,
	Button,
	Typography,
	Card,
} from "@mui/material";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/SnackbarContext";
import AddTodoForm from "@/components/todos/AddTodoForm";
import TodoSummary from "@/components/todos/TodoSummary";
import TodoHistory from "@/components/todos/TodoHistory";
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
	resetFilters: () => void;
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
	resetFilters,
}) => {
	const { snackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();

	return (
		<Box
			sx={{
				maxWidth: "1400px",
				mx: "auto",
				mt: 4,
				mb: 4,
				bgcolor: "transparent",
				p: 2,
			}}
		>
			<Grid container spacing={{ xs: 2, sm: 3 }}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #2e003e, #3d2352, #1b1b2f)",

							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							minHeight: { xs: "300px", sm: "350px", md: "400px" },
							display: "flex",
							flexDirection: "column",
						}}
					>
						<AddTodoForm
							categories={categories}
							statuses={statuses}
							loading={isLoading}
							onSubmit={handleSubmit}
							onCancel={initialFormData ? handleCancel : undefined}
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
												.slice(0, 16),
											notifyEnabled: initialFormData.notifyEnabled,
											notifyMinutesBefore: initialFormData.notifyMinutesBefore,
									  }
									: undefined
							}
							formData={formData}
							formErrors={formErrors}
							handleChange={handleFormChange}
						/>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)",

							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							minHeight: { xs: "300px", sm: "350px", md: "400px" },
							display: "flex",
							flexDirection: "column",
						}}
					>
						<TodoSummary
							todos={todos}
							statuses={statuses}
							todoFilters={todoFilters}
							setTodoFilters={setTodoFilters}
						/>
					</Card>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",

							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							minHeight: { xs: "300px", sm: "350px", md: "400px" },
							display: "flex",
							flexDirection: "column",
						}}
					>
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
							resetFilters={resetFilters}
						/>
					</Card>
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
