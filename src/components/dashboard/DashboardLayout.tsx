"use client";

import React, { useState } from "react";
import { Box, Grid, Snackbar, Alert, Typography, Card } from "@mui/material";
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
import { useFinanceData } from "@/hooks/finance/useFinanceData";
import { useTodoMutations } from "@/hooks/todos/useTodoMutations";
import { useTodoForm } from "@/hooks/todos/useTodoForm";

interface FormErrors {
	title?: string;
	status?: string;
	priority?: string;
	category?: string;
	dueDate?: string;
	description?: string;
	notifyMinutesBefore?: string;
}

interface DashboardProps {
	initialFinances: FinanceType[];
	initialCategories: FinanceCategoryType[];
	initialTodos: TodoType[];
	initialTodoCategories: CategoryType[];
	initialStatuses: StatusType[];
}

const DashboardLayout: React.FC<DashboardProps> = ({
	initialFinances,
	initialCategories,
	initialTodos,
	initialTodoCategories,
	initialStatuses,
}) => {
	const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
	const [editFinance, setEditFinance] = useState<FinanceType | undefined>(
		undefined
	);
	const [editTodo, setEditTodo] = useState<TodoType | undefined>(undefined);
	const [transactionFilters, setTransactionFilters] =
		useState<TransactionFilters>({
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear(),
			type: "all" as FinanceEntryType,
			category: "all",
			dayOfWeek: "all",
			period: "today",
		});
	const [summaryFilters, setSummaryFilters] = useState<SummaryFilters>({
		period: "today",
	});
	const [pagination, setPagination] = useState<PaginationType>({
		page: 1,
		limit: 10,
		total: initialFinances.length,
		totalPages: Math.ceil(initialFinances.length / 10),
	});

	const {
		categories,
		transactionFinances,
		summaryFinances,
		isLoading,
		addOrUpdateMutation,
		deleteMutation,
	} = useFinanceData({
		initialFinances,
		initialCategories,
		initialPagination: pagination,
		transactionFilters,
		summaryFilters,
		pagination,
	});

	const { addTodo, updateTodo, deleteTodo, completeTodo, isMutating } =
		useTodoMutations(
			(snackbar) => showSnackbar(snackbar),
			() => setEditTodo(undefined),
			initialStatuses
		);

	const { formData, errors, handleSubmit, handleChange } = useTodoForm({
		statuses: initialStatuses,
		categories: initialTodoCategories,
		initialData: editTodo
			? {
					id: editTodo.id,
					title: editTodo.title,
					description: editTodo.description || "",
					status: editTodo.status,
					priority: editTodo.priority,
					category: editTodo.category,
					dueDate: editTodo.dueDate.slice(0, 16),
					notifyEnabled: editTodo.notifyEnabled,
					notifyMinutesBefore: editTodo.notifyMinutesBefore,
			  }
			: undefined,
		onSubmit: async (data) => {
			data.id ? await updateTodo(data) : await addTodo(data);
		},
	});

	const handleAddOrUpdateFinance = async (data: {
		id: string | null;
		type: FinanceEntryType;
		amount: number;
		category: string;
		description?: string;
		date: string;
	}) => {
		try {
			await addOrUpdateMutation.mutateAsync(data);
			setEditFinance(undefined);
			showSnackbar({
				open: true,
				message: data.id
					? "Transaction updated successfully!"
					: "Transaction added successfully!",
				severity: "success",
			});
		} catch (error) {
			showSnackbar({
				open: true,
				message: (error as Error).message || "Error saving transaction",
				severity: "error",
			});
		}
	};

	const handleEditFinance = (finance: FinanceType) => {
		if (!finance || !finance.id) {
			showSnackbar({
				open: true,
				message: "Invalid transaction data",
				severity: "error",
			});
			return;
		}
		setEditFinance(finance);
		showSnackbar({
			open: true,
			message: "Transaction loaded for editing",
			severity: "success",
		});
	};

	const handleDeleteFinance = async (id: string) => {
		try {
			await deleteMutation.mutateAsync(id);
			showSnackbar({
				open: true,
				message: "Transaction deleted successfully!",
				severity: "success",
			});
		} catch (error) {
			showSnackbar({
				open: true,
				message: (error as Error).message || "Error deleting transaction",
				severity: "error",
			});
		}
	};

	const handleEditTodo = (todo: TodoType) => {
		if (!todo || !todo.id) {
			showSnackbar({
				open: true,
				message: "Invalid todo data",
				severity: "error",
			});
			return;
		}
		setEditTodo(todo);
		showSnackbar({
			open: true,
			message: "Todo loaded for editing",
			severity: "success",
		});
	};

	const handleDeleteTodo = async (id: string) => {
		try {
			await deleteTodo(id);
			showSnackbar({
				open: true,
				message: "Todo deleted successfully!",
				severity: "success",
			});
		} catch (error: any) {
			showSnackbar({
				open: true,
				message: error.message || "Failed to delete todo",
				severity: "error",
			});
		}
	};

	const handleCompleteTodo = async (id: string) => {
		const completedStatus = initialStatuses.find((s) => s.name === "Completed");
		if (!completedStatus) {
			showSnackbar({
				open: true,
				message: "No 'Completed' status found.",
				severity: "error",
			});
			return;
		}
		try {
			await completeTodo(id, completedStatus.name);
			showSnackbar({
				open: true,
				message: "Todo marked as completed!",
				severity: "success",
			});
		} catch (error: any) {
			showSnackbar({
				open: true,
				message: error.message || "Failed to mark todo as completed",
				severity: "warning",
			});
		}
	};

	const handleCancel = () => {
		setEditFinance(undefined);
		setEditTodo(undefined);
	};

	const handleFilteredFinancesChange = (filteredFinances: FinanceType[]) => {
		setPagination((prev) => ({
			...prev,
			total: filteredFinances.length,
			totalPages: Math.ceil(filteredFinances.length / prev.limit),
		}));
	};

	return (
		<Box
			sx={{
				maxWidth: "1400px",
				mx: "auto",
				mt: 4,
				minHeight: "100vh",
			}}
		>
			<Card
				sx={{
					borderRadius: "24px",
					overflow: "hidden",
					mb: 3,
					background: "linear-gradient(135deg, #eceff1 0%, #b0bec5 100%)",
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
				}}
			>
				<HeroAdmin />
			</Card>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #4caf50 0%, #26a69a 100%)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
						}}
					>
						<AddTransactionForm
							categories={categories}
							loading={isLoading || addOrUpdateMutation.isPending}
							onSubmit={handleAddOrUpdateFinance}
							onCancel={editFinance ? handleCancel : undefined}
							initialData={
								editFinance
									? {
											id: editFinance.id,
											type: editFinance.type,
											amount: editFinance.amount.toString(),
											category: editFinance.category,
											description: editFinance.description || "",
											date: new Date(editFinance.date)
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
							background: "linear-gradient(135deg, #0288d1 0%, #4fc3f7 100%)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
						}}
					>
						<FinanceSummary
							finances={summaryFinances}
							filters={summaryFilters}
							setFilters={setSummaryFilters}
						/>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #ffb300 0%, #ffca28 100%)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
						}}
					>
						<AddTodoForm
							categories={initialTodoCategories}
							statuses={initialStatuses}
							loading={isMutating}
							onSubmit={handleSubmit}
							onCancel={handleCancel}
							initialData={
								editTodo
									? {
											id: editTodo.id,
											title: editTodo.title,
											description: editTodo.description || "",
											status: editTodo.status,
											priority: editTodo.priority,
											category: editTodo.category,
											dueDate: new Date(editTodo.dueDate)
												.toISOString()
												.slice(0, 16),
											notifyEnabled: editTodo.notifyEnabled,
											notifyMinutesBefore: editTodo.notifyMinutesBefore,
									  }
									: undefined
							}
							formData={formData}
							formErrors={errors}
							handleChange={handleChange}
						/>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 8 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
						}}
					>
						<MustToDo
							todos={initialTodos}
							statuses={initialStatuses}
							categories={initialTodoCategories}
							loading={isMutating}
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
