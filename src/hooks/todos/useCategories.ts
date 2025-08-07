import { useQuery } from "@tanstack/react-query";
import { CategoryType } from "@/types/interface";
import { fetchTodoCategories } from "@/utils/todoApi";

interface UseCategoriesResult {
    categories: CategoryType[];
    isLoading: boolean;
    error: unknown;
}

export const useCategories = (initialCategories?: CategoryType[]): UseCategoriesResult => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchTodoCategories,
        initialData: initialCategories,
    });

    return {
        categories: data || [],
        isLoading,
        error,
    };
};