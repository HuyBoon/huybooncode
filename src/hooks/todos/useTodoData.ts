// hooks/todos/useTodoData.ts
import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import {
    TodoType,
    StatusType,
    CategoryType,
    PaginationType,
    TodoFilters,
} from "@/types/interface";
import { fetchTodos } from "@/services/todos/todoApi";
import { useCategories } from "./useCategories";

interface UseTodoDataProps {
    initialTodos: TodoType[];
    initialStatuses: StatusType[];
    initialCategories: CategoryType[];
    initialPagination: PaginationType;
    todoFilters: TodoFilters;
    pagination: PaginationType;
}

export const useTodoData = ({
    initialTodos,
    initialStatuses,
    initialCategories,
    initialPagination,
    todoFilters,
    pagination,
}: UseTodoDataProps) => {
    const { categories, isLoading: isCategoriesLoading } = useCategories(initialCategories);

    const { data: todoData, isLoading: isTodoLoading } = useQuery({
        queryKey: ["todos", pagination.page, pagination.limit, todoFilters],
        queryFn: () =>
            fetchTodos({
                page: pagination.page,
                limit: pagination.limit,
                status: todoFilters.status !== "all" ? todoFilters.status : undefined,
                category: todoFilters.category !== "all" ? todoFilters.category : undefined,
                priority:
                    todoFilters.priority !== "all"
                        ? (todoFilters.priority as "low" | "medium" | "high")
                        : undefined,
                dueDate: todoFilters.dueDate,
                period: todoFilters.period,
            }),
        initialData: { data: initialTodos, pagination: initialPagination },
        placeholderData: keepPreviousData,
    });

    return {
        statuses: initialStatuses,
        categories,
        todos: todoData?.data || [],
        isLoading: isTodoLoading || isCategoriesLoading,
        pagination: todoData?.pagination || pagination,
    };
};