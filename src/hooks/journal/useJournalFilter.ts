"use client";

import { useState } from "react";
import { MoodType, PaginationType } from "@/types/interface";

interface JournalFilters {
    date?: string;
    mood: string;
    period: string;
}

export const useJournalFilter = (initialMoods: MoodType[], initialPagination: PaginationType) => {
    const [filters, setFilters] = useState<JournalFilters>({
        date: "",
        mood: "all",
        period: "all",
    });
    const [pagination, setPagination] = useState<PaginationType>({
        ...initialPagination,
        page: 1,
        limit: initialPagination.limit || 10,
    });

    const resetFilters = () => {
        setFilters({
            date: "",
            mood: "all",
            period: "all",
        });
        setPagination({ ...initialPagination, page: 1 });
    };

    const handleFilterChange = (name: keyof JournalFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [name]: value || "" })); // Handle empty value
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