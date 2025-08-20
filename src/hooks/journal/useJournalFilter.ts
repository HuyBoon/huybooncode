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
        date: new Date().toISOString().slice(0, 7), // YYYY-MM
        mood: "all",
        period: "today",
    });
    const [pagination, setPagination] = useState<PaginationType>(initialPagination);

    const resetFilters = () => {
        setFilters({
            date: new Date().toISOString().slice(0, 7),
            mood: "all",
            period: "today",
        });
        setPagination({ ...initialPagination, page: 1 });
    };

    const handleFilterChange = (name: keyof JournalFilters, value: string) => {
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