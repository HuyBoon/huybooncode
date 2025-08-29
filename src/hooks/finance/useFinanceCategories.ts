import { useQuery } from "@tanstack/react-query";
import { FinanceCategoryType } from "@/types/interface";
import { getFinanceCategories } from "@/services/finances/finaceService";

interface UseFinanceCategoriesResult {
    categories: FinanceCategoryType[];
    isLoading: boolean;
    error: unknown;
}

export const useFinanceCategories = (initialCategories?: FinanceCategoryType[]): UseFinanceCategoriesResult => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["financeCategories"],
        queryFn: getFinanceCategories,
        initialData: initialCategories,
        staleTime: 1000 * 60 * 60, // Cache for 1 hour, since categories rarely change
    });

    return {
        categories: data || [],
        isLoading,
        error,
    };
};