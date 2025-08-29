import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoType, PaginationType, TodoFilters } from "@/types/interface";
import { v4 as uuidv4 } from 'uuid';

interface FormData {
    id?: string;
    title: string;
    description: string;
    status: string;
    priority: "low" | "medium" | "high";
    category: string;
    dueDate: string;
    notifyEnabled: boolean;
    notifyMinutesBefore: number;
}

interface QueryData {
    data: TodoType[];
    pagination: PaginationType;
}

interface UseTodoMutationsResult {
    addTodo: (formData: FormData) => Promise<TodoType>;
    updateTodo: (formData: FormData) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    completeTodo: (id: string, statusName: string) => Promise<void>;
    isMutating: boolean;
}

interface UseTodoMutationsProps {
    setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" | "warning" }) => void;
    resetForm: () => void | Promise<void>;
    statuses: { id: string; name: string }[];
    pagination?: PaginationType;
    todoFilters?: TodoFilters;
}

export const useTodoMutations = ({
    setSnackbar,
    resetForm,
    statuses,
    pagination,
    todoFilters,
}: UseTodoMutationsProps): UseTodoMutationsResult => {
    const queryClient = useQueryClient();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

    const addTodoMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const { id, ...data } = formData;
            const response = await fetch(`${baseUrl}/api/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add todo");
            }
            return response.json();
        },
        onMutate: async (formData: FormData) => {
            // Hủy queries đang chạy để tránh race condition
            await queryClient.cancelQueries({ queryKey: ["todos", pagination?.page, pagination?.limit, todoFilters] });

            // Lưu snapshot cache hiện tại để rollback nếu lỗi
            const previousTodos = queryClient.getQueryData<QueryData>(["todos", pagination?.page, pagination?.limit, todoFilters]);


            const tempId = `temp-${uuidv4()}`;
            const now = new Date().toISOString();
            const optimisticTodo: TodoType = {
                id: tempId,
                title: formData.title,
                description: formData.description || "",
                status: formData.status,
                priority: formData.priority,
                category: formData.category,
                dueDate: formData.dueDate,
                notifyEnabled: formData.notifyEnabled,
                notifyMinutesBefore: formData.notifyMinutesBefore,
                notificationSent: false,
                createdAt: now,
                updatedAt: now,
            };

            // Cập nhật cache lạc quan
            queryClient.setQueryData(
                ["todos", pagination?.page, pagination?.limit, todoFilters],
                (oldData: QueryData | undefined) => {
                    if (!oldData) {
                        return {
                            data: [optimisticTodo],
                            pagination: { page: 1, limit: pagination?.limit || 10, total: 1, totalPages: 1 },
                        };
                    }
                    return {
                        ...oldData,
                        data: [optimisticTodo, ...oldData.data],
                        pagination: {
                            ...oldData.pagination,
                            total: oldData.pagination.total + 1,
                            totalPages: Math.ceil((oldData.pagination.total + 1) / oldData.pagination.limit),
                        },
                    };
                }
            );

            // Trả về context để rollback
            return { previousTodos };
        },
        onSuccess: async (newTodo: TodoType, formData, context) => {
            console.log("New Todo from server:", newTodo);
            // Cập nhật cache với newTodo thực từ server
            queryClient.setQueryData(
                ["todos", pagination?.page, pagination?.limit, todoFilters],
                (oldData: QueryData | undefined) => {
                    if (!oldData) {
                        return {
                            data: [newTodo],
                            pagination: { page: 1, limit: pagination?.limit || 10, total: 1, totalPages: 1 },
                        };
                    }
                    return {
                        ...oldData,
                        data: oldData.data.map((todo) =>
                            todo.id === `temp-${Date.now()}` ? { ...todo, ...newTodo, id: newTodo.id } : todo
                        ),
                        pagination: {
                            ...oldData.pagination,
                            total: oldData.pagination.total,
                            totalPages: oldData.pagination.totalPages,
                        },
                    };
                }
            );

            // Invalidate để đồng bộ nếu cần
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            queryClient.invalidateQueries({ queryKey: ["summaryTodos"] });
            setSnackbar({
                open: true,
                message: "Todo added!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any, formData, context) => {
            // Rollback cache nếu lỗi
            if (context?.previousTodos) {
                queryClient.setQueryData(
                    ["todos", pagination?.page, pagination?.limit, todoFilters],
                    context.previousTodos
                );
            }
            setSnackbar({
                open: true,
                message: error.message || "Error adding todo",
                severity: "error",
            });
        },
        onSettled: () => {
            // Đảm bảo invalidate sau khi mutation hoàn tất
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const updateTodoMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${baseUrl}/api/todos/${formData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update todo");
            }
            return response.json();
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            queryClient.invalidateQueries({ queryKey: ["summaryTodos"] });
            setSnackbar({
                open: true,
                message: "Todo updated!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || "Error updating todo",
                severity: "error",
            });
        },
    });

    const deleteTodoMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${baseUrl}/api/todos/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete todo");
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            queryClient.invalidateQueries({ queryKey: ["summaryTodos"] });
            setSnackbar({
                open: true,
                message: "Todo deleted!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || "Error deleting todo",
                severity: "error",
            });
        },
    });

    const completeTodoMutation = useMutation({
        mutationFn: async ({ id, statusName }: { id: string; statusName: string }) => {
            const response = await fetch(`${baseUrl}/api/todos/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch todo");
            }
            const todo: TodoType = await response.json();

            const updatedData = {
                title: todo.title,
                description: todo.description || "",
                status: statusName,
                priority: todo.priority,
                category: todo.category,
                dueDate: todo.dueDate,
                notifyEnabled: todo.notifyEnabled,
                notifyMinutesBefore: todo.notifyMinutesBefore,
                notificationSent: true,
            };

            const updateResponse = await fetch(`${baseUrl}/api/todos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.error || "Failed to mark todo as completed");
            }
            return updateResponse.json();
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            queryClient.invalidateQueries({ queryKey: ["summaryTodos"] });
            setSnackbar({
                open: true,
                message: "Todo marked as completed!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || "Error marking todo as completed",
                severity: "warning",
            });
        },
    });

    return {
        addTodo: async (formData: FormData) => {
            return await addTodoMutation.mutateAsync(formData);
        },
        updateTodo: async (formData: FormData) => {
            await updateTodoMutation.mutateAsync(formData);
        },
        deleteTodo: async (id: string) => {
            await deleteTodoMutation.mutateAsync(id);
        },
        completeTodo: async (id: string, statusName: string) => {
            await completeTodoMutation.mutateAsync({ id, statusName });
        },
        isMutating:
            addTodoMutation.isPending ||
            updateTodoMutation.isPending ||
            deleteTodoMutation.isPending ||
            completeTodoMutation.isPending,
    };
};