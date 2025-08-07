import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface UseFinanceFiltersProps {
    initialPagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const useFinanceFilters = ({ initialPagination }: UseFinanceFiltersProps) => {
    const [filters, setFilters] = useState<{
        month: number;
        year: number;
        type:
        | "all"
        | "income"
        | "expense"
        | "saving"
        | "investment"
        | "debt"
        | "loan"
        | "other";
        category: string;
        dayOfWeek: "all" | number;
        period: "today" | "yesterday" | "week" | "month" | "year";
    }>({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        type: "all",
        category: "all",
        dayOfWeek: "all",
        period: "today",
    });

    const [pagination, setPagination] = useState<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>(initialPagination);

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
    }, []);

    return { filters, setFilters, pagination, setPagination, resetFilters };
};