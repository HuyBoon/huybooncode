import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import {
    TodoType,
    StatusType,
    CategoryType,
    PaginationType,
    TodoFilters,
    SummaryToDoFilters,
} from "@/types/interface";
import { fetchTodos, fetchTodoCategories } from "@/utils/todoApi";

interface UseTodoDataProps {
    initialTodos: TodoType[];
    initialStatuses: StatusType[];
    initialCategories: CategoryType[];
    initialPagination: PaginationType;
    todoFilters: TodoFilters;
    summaryFilters: SummaryToDoFilters;
    pagination: PaginationType;
}

export const useTodoData = ({
    initialTodos,
    initialStatuses,
    initialCategories,
    initialPagination,
    todoFilters,
    summaryFilters,
    pagination,
}: UseTodoDataProps) => {
    const { data: todoData, isLoading: isTodoLoading } = useQuery({
        queryKey: ["todos", pagination.page, pagination.limit, todoFilters],
        queryFn: () =>
            fetchTodos({
                page: pagination.page,
                limit: pagination.limit,
                status: todoFilters.status !== "all" ? todoFilters.status : undefined,
                category: todoFilters.category !== "all" ? todoFilters.category : undefined,
                priority: todoFilters.priority !== "all" ? (todoFilters.priority as "low" | "medium" | "high") : undefined,
                dueDate: todoFilters.dueDate,
            }),
        initialData: { data: initialTodos, pagination: initialPagination },
        placeholderData: keepPreviousData,
    });

    const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["summaryTodos", summaryFilters.period],
        queryFn: () =>
            fetchTodos({
                status: todoFilters.status !== "all" ? todoFilters.status : undefined,
                category: todoFilters.category !== "all" ? todoFilters.category : undefined,
                priority: todoFilters.priority !== "all" ? (todoFilters.priority as "low" | "medium" | "high") : undefined,
                period: summaryFilters.period,
            }),
        initialData: { data: initialTodos, pagination: initialPagination },
        placeholderData: keepPreviousData,
    });

    const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchTodoCategories,
        initialData: initialCategories,
        placeholderData: keepPreviousData,
    });

    return {
        statuses: initialStatuses,
        categories: categoriesData || [],
        todos: todoData?.data || [],
        summaryTodos: summaryData?.data || [],
        isLoading: isTodoLoading || isSummaryLoading || isCategoriesLoading,
        pagination: todoData?.pagination || pagination,
    };
};