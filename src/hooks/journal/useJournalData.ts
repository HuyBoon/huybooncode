import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { fetchJournals } from "@/utils/apiJournal";
import { JournalType, MoodType, PaginationType } from "@/types/interface";

interface JournalFilters {
    period?: string;
    date?: string;
    mood?: string;
}

interface UseJournalDataProps {
    initialJournals: JournalType[];
    initialMoods: MoodType[];
    initialPagination: PaginationType;
    journalFilters: JournalFilters;
    pagination: PaginationType;
}

export const useJournalData = ({
    initialJournals,
    initialMoods,
    initialPagination,
    journalFilters,
    pagination,
}: UseJournalDataProps) => {
    const { data: journalData, isLoading } = useQuery({
        queryKey: ["journals", pagination.page, pagination.limit, journalFilters],
        queryFn: () =>
            fetchJournals({
                period: journalFilters.period,
                date: journalFilters.date,
                mood: journalFilters.mood !== "all" ? journalFilters.mood : undefined,
                page: pagination.page,
                limit: pagination.limit,
            }),
        initialData: { data: initialJournals, pagination: initialPagination },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // Cache 5 phút
    });

    return {
        journals: journalData?.data || [],
        moods: initialMoods,
        isLoading,
        pagination: journalData?.pagination || initialPagination,
    };
};