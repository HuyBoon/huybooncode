"use client";

import { useQuery } from "@tanstack/react-query";
import { JournalType, MoodType, PaginationType, JournalFilters } from "@/types/interface";
import { fetchJournals } from "@/services/journals/apiJournal";

interface UseJournalDataProps {
    initialJournals: JournalType[];
    initialMoods: MoodType[];
    initialPagination: PaginationType;
    pagination: PaginationType;
    filters: JournalFilters; // Updated to require mood and period as strings
}

export const useJournalData = ({
    initialJournals,
    initialMoods,
    initialPagination,
    pagination,
    filters,
}: UseJournalDataProps) => {
    // Ensure pagination is always defined
    const safePagination = {
        page: pagination.page || initialPagination.page || 1,
        limit: pagination.limit || initialPagination.limit || 10,
        total: pagination.total || initialPagination.total || 0,
        totalPages: pagination.totalPages || initialPagination.totalPages || 1,
    };

    const { data, isLoading } = useQuery({
        queryKey: [
            "journals",
            safePagination.page,
            safePagination.limit,
            filters.mood,
            filters.period,
            filters.date,
        ],
        queryFn: async () => {
            return fetchJournals({
                page: safePagination.page,
                limit: safePagination.limit,
                mood: filters.mood !== "all" ? filters.mood : undefined,
                period: filters.period !== "all" ? filters.period : undefined,
                date: filters.date,
            });
        },
        initialData: {
            data: initialJournals,
            pagination: initialPagination,
        },
        retry: 3,
        retryDelay: 2000,
    });

    return {
        journals: data?.data || [],
        moods: initialMoods,
        isLoading,
        pagination: data?.pagination || safePagination,
    };
};