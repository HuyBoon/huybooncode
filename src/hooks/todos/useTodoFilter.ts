import { useState } from "react";
import { CategoryType, PaginationType } from "@/types/interface";

interface TodoFilters {
    dueDate: string;
    status: string;
    priority: string;
    category: string;
}

export const useTodoFilter = (initialCategories: CategoryType[], initialPagination: PaginationType) => {

    const [filters, setFilters] = useState<TodoFilters>({
        dueDate: new Date().toISOString().split("T")[0].slice(0, 7), // YYYY-MM
        status: "all",
        priority: "all",
        category: "all",
    });
    const [pagination, setPagination] = useState<PaginationType>(initialPagination);

    const resetFilters = () => {
        setFilters({
            dueDate: new Date().toISOString().split("T")[0].slice(0, 7),
            status: "all",
            priority: "all",
            category: "all",
        });
        setPagination({ ...initialPagination, page: 1 });
    };

    const handleFilterChange = (name: keyof TodoFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    return {
        filters,
        setFilters,
        pagination,
        setPagination,
        resetFilters,
        handleFilterChange,
    };
};