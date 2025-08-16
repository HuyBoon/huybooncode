import React from "react";
import { Box, Grid, Snackbar, Alert, Card } from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext";
import AddTransactionForm from "@/components/finance/AddTransactionForm";
import FinanceSummary from "@/components/finance/FinanceSummary";
import AddTodoForm from "@/components/todos/AddTodoForm";
import MustToDo from "@/components/todos/MustToDo";
import HeroAdmin from "./HeroAdmin";
import {
	FinanceType,
	FinanceCategoryType,
	TransactionFilters,
	PaginationType,
	FinanceEntryType,
	SummaryFilters,
	TodoType,
	StatusType,
	CategoryType,
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

interface DashboardLayoutProps {
	categories: FinanceCategoryType[];
	todoCategories: CategoryType[];
	statuses: StatusType[];
	todos: TodoType[];
	finances: FinanceType[];
	summaryFinances: FinanceType[];
	isFinanceLoading: boolean;
	isTodoLoading: boolean;
	pagination: PaginationType;
	transactionFilters: TransactionFilters;
	setTransactionFilters: React.Dispatch<
		React.SetStateAction<TransactionFilters>
	>;
	summaryFilters: SummaryFilters;
	setSummaryFilters: React.Dispatch<React.SetStateAction<SummaryFilters>>;
	setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
	handleAddOrUpdateFinance: (data: {
		id: string | null;
		type: FinanceEntryType;
		amount: number;
		category: string;
		description?: string;
		date: string;
	}) => Promise<void>;
	handleEditFinance: (finance: FinanceType) => void;
	handleDeleteFinance: (id: string) => Promise<void>;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
	handleEditTodo: (todo: TodoType) => void;
	handleDeleteTodo: (id: string) => Promise<void>;
	handleCompleteTodo: (id: string) => Promise<void>;
	handleCancel: () => void;
	initialFinanceData?: FinanceType;
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
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
	categories,
	todoCategories,
	statuses,
	todos,
	finances,
	summaryFinances,
	isFinanceLoading,
	isTodoLoading,
	pagination,
	transactionFilters,
	setTransactionFilters,
	summaryFilters,
	setSummaryFilters,
	setPagination,
	handleAddOrUpdateFinance,
	handleEditFinance,
	handleDeleteFinance,
	handleSubmit,
	handleEditTodo,
	handleDeleteTodo,
	handleCompleteTodo,
	handleCancel,
	initialFinanceData,
	initialFormData,
	formData,
	formErrors,
	handleFormChange,
}) => {
	const { snackbar, closeSnackbar } = useSnackbar();

	return (
		<Box
			sx={{
				maxWidth: "1400px",
				mx: "auto",
				mt: 4,
				mb: 4,
				bgcolor: "transparent",
			}}
		>
			<Card
				sx={{
					borderRadius: "24px",
					overflow: "hidden",
					mb: 3,
					background: "linear-gradient(135deg, #4b5e7a 0%, #26384e 100%)",
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
					minHeight: { xs: "150px", sm: "200px", md: "250px" },
				}}
			>
				<HeroAdmin />
			</Card>
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
						<AddTransactionForm
							categories={categories}
							loading={isFinanceLoading}
							onSubmit={handleAddOrUpdateFinance}
							onCancel={initialFinanceData ? handleCancel : undefined}
							initialData={
								initialFinanceData
									? {
											id: initialFinanceData.id,
											type: initialFinanceData.type,
											amount: initialFinanceData.amount.toString(),
											category: initialFinanceData.category,
											description: initialFinanceData.description || "",
											date: new Date(initialFinanceData.date)
												.toISOString()
												.split("T")[0],
									  }
									: undefined
							}
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
						<FinanceSummary
							finances={summaryFinances}
							filters={summaryFilters}
							setFilters={setSummaryFilters}
						/>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 5 }}>
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
						<AddTodoForm
							categories={todoCategories}
							statuses={statuses}
							loading={isTodoLoading}
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
				<Grid size={{ xs: 12, md: 7 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #5e35b1 0%, #4527a0 100%)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							minHeight: { xs: "300px", sm: "350px", md: "400px" },
							display: "flex",
							flexDirection: "column",
						}}
					>
						<MustToDo
							todos={todos}
							statuses={statuses}
							categories={todoCategories}
							loading={isTodoLoading}
							handleEdit={handleEditTodo}
							handleDelete={handleDeleteTodo}
							handleComplete={handleCompleteTodo}
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

export default DashboardLayout;
