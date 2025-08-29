// hooks/todos/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import { CategoryType } from "@/types/interface";
import { fetchTodoCategories } from "@/services/todos/todoApi";


interface UseCategoriesResult {
    categories: CategoryType[];
    isLoading: boolean;
    error: unknown;
    refetch: () => void; // Add refetch function for manual refresh
}

export const useCategories = (
    initialCategories: CategoryType[] = []
): UseCategoriesResult => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchTodoCategories,
        initialData: initialCategories.length > 0 ? initialCategories : undefined,
        staleTime: Infinity, // Never consider data stale
        gcTime: Infinity, // Keep data in cache indefinitely
        enabled: initialCategories.length === 0, // Only fetch if no initial data
    });

    return {
        categories: data || initialCategories || [],
        isLoading,
        error,
        refetch,
    };
};