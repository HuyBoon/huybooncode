import { useCallback } from "react";
import { TransactionFilters } from "@/types/interface";

interface UseTransactionFiltersProps {
    setFilters: React.Dispatch<React.SetStateAction<TransactionFilters>>;
    setPagination: React.Dispatch<
        React.SetStateAction<{
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        }>
    >;
}

export const useTransactionFilters = ({ setFilters, setPagination }: UseTransactionFiltersProps) => {
    const handleFilterChange = useCallback(
        (newFilters: Partial<TransactionFilters>, resetPage: boolean = false) => {
            setFilters((prev) => ({ ...prev, ...newFilters }));
            if (resetPage) {
                setPagination((prev) => ({ ...prev, page: 1 }));
            }
        },
        [setFilters, setPagination]
    );

    const resetFilters = useCallback(() => {
        setFilters({
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            type: "all",
            category: "all",
            dayOfWeek: "all",
            period: "today",
        });
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [setFilters, setPagination]);

    return { handleFilterChange, resetFilters };
};