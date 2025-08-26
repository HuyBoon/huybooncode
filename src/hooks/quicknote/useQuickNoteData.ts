"use client";

import { useQuery } from "@tanstack/react-query";
import { QuickNoteType, PaginationType, QuickNoteFilters } from "@/types/interface";
import { fetchQuickNotes } from "@/utils/apiQuickNote";

interface UseQuickNoteDataProps {
    initialQuickNotes: QuickNoteType[];
    initialPagination: PaginationType;
    pagination: PaginationType;
    filters: QuickNoteFilters;
}

export const useQuickNoteData = ({
    initialQuickNotes,
    initialPagination,
    pagination,
    filters,
}: UseQuickNoteDataProps) => {
    const safePagination = {
        page: pagination.page || initialPagination.page || 1,
        limit: pagination.limit || initialPagination.limit || 10,
        total: pagination.total || initialPagination.total || 0,
        totalPages: pagination.totalPages || initialPagination.totalPages || 1,
    };

    const { data, isLoading } = useQuery({
        queryKey: ["quickNotes", safePagination.page, safePagination.limit, filters.period, filters.date, filters.category],
        queryFn: async () => {
            return fetchQuickNotes({
                page: safePagination.page,
                limit: safePagination.limit,
                period: filters.period !== "all" ? filters.period : undefined,
                date: filters.date,
                category: filters.category !== "all" ? filters.category : undefined,
            });
        },
        initialData: {
            data: initialQuickNotes,
            pagination: initialPagination,
        },
        retry: 3,
        retryDelay: 2000,
    });

    return {
        quickNotes: data?.data || [],
        isLoading,
        pagination: data?.pagination || safePagination,
    };
};