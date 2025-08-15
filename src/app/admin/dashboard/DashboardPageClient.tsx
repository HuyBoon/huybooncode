"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext";
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
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useFinanceData } from "@/hooks/finance/useFinanceData";
import { useTodoMutations } from "@/hooks/todos/useTodoMutations";
import { useTodoForm } from "@/hooks/todos/useTodoForm";
import { fetchTodos } from "@/utils/todoApi";

interface DashboardPageClientProps {
	initialFinances: FinanceType[];
	initialCategories: FinanceCategoryType[];
	initialTodos: TodoType[];
	initialTodoCategories: CategoryType[];
	initialStatuses: StatusType[];
	initialPagination: PaginationType;
}

const DashboardPageClient: React.FC<DashboardPageClientProps> = ({
	initialFinances,
	initialCategories,
	initialTodos,
	initialTodoCategories,
	initialStatuses,
	initialPagination,
}) => {
	const { showSnackbar } = useSnackbar();

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
	const [pagination, setPagination] =
		useState<PaginationType>(initialPagination);
	const [editFinance, setEditFinance] = useState<FinanceType | undefined>(
		undefined
	);
	const [editTodo, setEditTodo] = useState<TodoType | undefined>(undefined);
	const [todos, setTodos] = useState<TodoType[]>(initialTodos); // State động cho todos

	const {
		categories,
		transactionFinances,
		summaryFinances,
		isLoading: isFinanceLoading,
		addOrUpdateMutation,
		deleteMutation,
		pagination: fetchedPagination,
	} = useFinanceData({
		initialFinances,
		initialCategories,
		initialPagination,
		transactionFilters,
		summaryFilters,
		pagination,
	});

	const {
		addTodo,
		updateTodo,
		deleteTodo,
		completeTodo,
		isMutating: isTodoLoading,
	} = useTodoMutations(
		(snackbar) => showSnackbar(snackbar),
		async () => {
			setEditTodo(undefined);
			await refetchTodos(); // Refetch todos sau add/update
		},
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

	const refetchTodos = async () => {
		try {
			const res = await fetchTodos({ period: "today" }); 
			setTodos(res.data);
		} catch (error) {
			console.error("Failed to refetch todos:", error);
			showSnackbar({
				open: true,
				message: "Failed to refresh todo list",
				severity: "error",
			});
		}
	};

	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const now = new Date();
				const inOneMinute = new Date(now.getTime() + 60 * 1000);

				const todosToNotify = await fetchTodos({
					notifyEnabled: true,
					notificationSent: false,
					dateTimeRange: {
						start: now.toISOString(),
						end: inOneMinute.toISOString(),
					},
				});

				for (const todo of todosToNotify.data) {
					const notificationTime = new Date(
						new Date(todo.dueDate).getTime() -
							todo.notifyMinutesBefore * 60 * 1000
					);
					if (
						now >= notificationTime &&
						now <= new Date(notificationTime.getTime() + 60 * 1000)
					) {
						showSnackbar({
							open: true,
							message: `Reminder: Todo "${todo.title}" is due soon!`,
							severity: "warning",
						});
						const response = await fetch(`/api/todos/${todo.id}`, {
							method: "GET",
							headers: { "Content-Type": "application/json" },
						});
						if (!response.ok) {
							console.error("Failed to fetch todo for notification update");
							continue;
						}
						const fullTodo: TodoType = await response.json();
						await fetch(`/api/todos/${todo.id}`, {
							method: "PUT",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								title: fullTodo.title,
								description: fullTodo.description || "",
								status: fullTodo.status,
								priority: fullTodo.priority,
								category: fullTodo.category,
								dueDate: fullTodo.dueDate,
								notifyEnabled: fullTodo.notifyEnabled,
								notifyMinutesBefore: fullTodo.notifyMinutesBefore,
								notificationSent: true,
							}),
						});
						await refetchTodos(); // Refetch todos sau notification update
					}
				}
			} catch (error: any) {
				console.error("Error checking notifications:", error);
			}
		}, 60 * 1000);

		return () => clearInterval(interval);
	}, [showSnackbar]);

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
			await refetchTodos(); // Refetch sau delete
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
			await refetchTodos(); // Refetch sau complete
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

	if (isFinanceLoading && !transactionFinances.length) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					backgroundColor: "transparent",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<DashboardLayout
			categories={categories}
			todoCategories={initialTodoCategories}
			statuses={initialStatuses}
			todos={todos}
			finances={transactionFinances}
			summaryFinances={summaryFinances}
			isFinanceLoading={isFinanceLoading}
			isTodoLoading={isTodoLoading}
			pagination={fetchedPagination}
			transactionFilters={transactionFilters}
			setTransactionFilters={setTransactionFilters}
			summaryFilters={summaryFilters}
			setSummaryFilters={setSummaryFilters}
			setPagination={setPagination}
			handleAddOrUpdateFinance={handleAddOrUpdateFinance}
			handleEditFinance={handleEditFinance}
			handleDeleteFinance={handleDeleteFinance}
			handleSubmit={handleSubmit}
			handleEditTodo={handleEditTodo}
			handleDeleteTodo={handleDeleteTodo}
			handleCompleteTodo={handleCompleteTodo}
			handleCancel={handleCancel}
			initialFinanceData={editFinance}
			initialFormData={editTodo}
			formData={formData}
			formErrors={errors}
			handleFormChange={handleChange}
		/>
	);
};

export default DashboardPageClient;
