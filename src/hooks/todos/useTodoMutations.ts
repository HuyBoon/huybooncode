import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoType, PaginationType } from "@/types/interface";

interface FormData {
    id?: string | null;
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
    addTodo: (formData: FormData) => Promise<void>;
    updateTodo: (formData: FormData) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    completeTodo: (id: string, statusName: string) => Promise<void>;
    isMutating: boolean;
}

export const useTodoMutations = (
    setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" | "warning" }) => void,
    resetForm: () => void,
    statuses: { id: string; name: string }[]
): UseTodoMutationsResult => {
    const queryClient = useQueryClient();

    const addTodoMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add todo");
            }
            return response.json();
        },
        onSuccess: (newTodo: TodoType) => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            queryClient.invalidateQueries({ queryKey: ["summaryTodos"] });
            setSnackbar({
                open: true,
                message: "Todo added!",
                severity: "success",
            });
            resetForm();
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || "Error adding todo",
                severity: "error",
            });
        },
    });

    const updateTodoMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${formData.id}`, {
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
        onSuccess: (updatedTodo: TodoType) => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            queryClient.invalidateQueries({ queryKey: ["summaryTodos"] });
            setSnackbar({
                open: true,
                message: "Todo updated!",
                severity: "success",
            });
            resetForm();
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete todo");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            queryClient.invalidateQueries({ queryKey: ["summaryTodos"] });
            setSnackbar({
                open: true,
                message: "Todo deleted!",
                severity: "success",
            });
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: statusName, notificationSent: true }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to mark todo as completed");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            queryClient.invalidateQueries({ queryKey: ["summaryTodos"] });
            setSnackbar({
                open: true,
                message: "Todo marked as completed!",
                severity: "success",
            });
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
            await addTodoMutation.mutateAsync(formData);
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