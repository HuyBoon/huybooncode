"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext";
import {
	TodoType,
	StatusType,
	CategoryType,
	PaginationType,
	TodoFilters,
	SummaryToDoFilters,
} from "@/types/interface";
import TodoLayout from "@/components/todos/TodoLayout";

import { fetchTodos } from "@/utils/todoApi";
import { useTodoData } from "@/hooks/todos/useTodoData";
import { useTodoMutations } from "@/hooks/todos/useTodoMutations";
import { useTodoForm } from "@/hooks/todos/useTodoForm";

const TodoPageClient: React.FC<{
	initialTodos: TodoType[];
	initialCategories: CategoryType[];
	initialStatuses: StatusType[];
	initialPagination: PaginationType;
}> = ({
	initialTodos,
	initialCategories,
	initialStatuses,
	initialPagination,
}) => {
	const { showSnackbar } = useSnackbar();

	const [todoFilters, setTodoFilters] = useState<TodoFilters>({
		dueDate: new Date().toISOString().slice(0, 7), // Current YYYY-MM
		status: "all",
		priority: "all",
		category: "all",
	});

	const [summaryFilters, setSummaryFilters] = useState<SummaryToDoFilters>({
		period: "today",
	});

	const [pagination, setPagination] =
		useState<PaginationType>(initialPagination);

	const [editTodo, setEditTodo] = useState<TodoType | undefined>(undefined);

	const {
		statuses,
		categories,
		todos,
		summaryTodos,
		isLoading,
		pagination: fetchedPagination,
	} = useTodoData({
		initialTodos,
		initialStatuses,
		initialCategories,
		initialPagination,
		todoFilters,
		summaryFilters,
		pagination,
	});

	const { addTodo, updateTodo, deleteTodo, completeTodo, isMutating } =
		useTodoMutations(
			(snackbar) => showSnackbar(snackbar),
			() => {
				setEditTodo(undefined);
				setTodoFilters({
					dueDate: new Date().toISOString().slice(0, 7),
					status: "all",
					priority: "all",
					category: "all",
				});
			},
			statuses
		);

	const { formData, errors, handleSubmit, handleChange } = useTodoForm({
		statuses,
		categories,
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
						// Fetch the full todo to ensure all required fields
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
					}
				}
			} catch (error: any) {
				console.error("Error checking notifications:", error);
			}
		}, 60 * 1000);

		return () => clearInterval(interval);
	}, [showSnackbar]);

	const handleEdit = (todo: TodoType) => {
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

	const handleDelete = async (id: string) => {
		try {
			await deleteTodo(id);
		} catch (error: any) {
			showSnackbar({
				open: true,
				message: error.message || "Failed to delete todo",
				severity: "error",
			});
		}
	};

	const handleComplete = async (id: string) => {
		const completedStatus = statuses.find((s) => s.name === "Completed");
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
		} catch (error: any) {
			showSnackbar({
				open: true,
				message: error.message || "Failed to mark todo as completed",
				severity: "warning",
			});
		}
	};

	const handleCancel = () => {
		setEditTodo(undefined);
	};

	if (isLoading && !todos.length) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					backgroundColor: "#f5f5f5",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<TodoLayout
			categories={categories}
			statuses={statuses}
			todos={todos}
			summaryTodos={summaryTodos}
			isLoading={isLoading || isMutating}
			pagination={fetchedPagination}
			todoFilters={todoFilters}
			setTodoFilters={setTodoFilters}
			summaryFilters={summaryFilters}
			setSummaryFilters={setSummaryFilters}
			setPagination={setPagination}
			handleSubmit={handleSubmit}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
			handleComplete={handleComplete}
			handleCancel={handleCancel}
			initialFormData={editTodo}
			formErrors={errors}
			formData={formData}
			handleFormChange={handleChange}
		/>
	);
};

export default TodoPageClient;
