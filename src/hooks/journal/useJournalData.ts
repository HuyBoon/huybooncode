"use client";

import { useQuery } from "@tanstack/react-query";
import { JournalType, MoodType, PaginationType } from "@/types/interface";
import { fetchJournals } from "@/utils/apiJournal";

interface JournalFilters {
    date?: string;
    mood: string;
    period: string;
}

interface UseJournalDataProps {
    initialJournals: JournalType[];
    initialMoods: MoodType[];
    initialPagination: PaginationType;
    pagination: PaginationType;
    filters?: JournalFilters;
}

export const useJournalData = ({
    initialJournals,
    initialMoods,
    initialPagination,
    pagination,
    filters,
}: UseJournalDataProps) => {
    // Ensure pagination is always defined
    const safePagination = pagination || initialPagination;

    const { data, isLoading } = useQuery({
        queryKey: [
            "journals",
            safePagination.page,
            safePagination.limit,
            filters?.mood,
            filters?.period,
            filters?.date,
        ],
        queryFn: async () => {
            return fetchJournals({
                page: safePagination.page,
                limit: safePagination.limit,
                mood: filters?.mood !== "all" ? filters?.mood : undefined,
                period: filters?.period,
                date: filters?.date,
            });
        },
        initialData: {
            data: initialJournals,
            pagination: initialPagination,
        },
    });

    return {
        journals: data?.data || [],
        moods: initialMoods,
        isLoading,
        pagination: data?.pagination || initialPagination,
    };
};