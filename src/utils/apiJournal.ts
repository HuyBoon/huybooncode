import { JournalType, PaginationType } from "@/types/interface";

interface FetchJournalsParams {
    page?: number;
    limit?: number;
    mood?: string;
    period?: string;
    date?: string;
    dateTimeRange?: {
        start: string;
        end: string;
    };
}

export const fetchJournals = async ({
    page = 1,
    limit = 10,
    mood,
    period,
    date,
    dateTimeRange,
}: FetchJournalsParams): Promise<{ data: JournalType[]; pagination: PaginationType }> => {
    const queryParams: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
    };

    if (mood && mood !== "all") {
        queryParams.mood = mood;
    }
    if (period && period !== "all") {
        queryParams.period = period;
    }
    if (date) {
        queryParams.date = date;
    }
    if (dateTimeRange) {
        queryParams.start = dateTimeRange.start;
        queryParams.end = dateTimeRange.end;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
    }

    const response = await fetch(`${baseUrl}/api/journal?${queryString}`);
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData || "Failed to fetch journals"}`);
    }

    const data = await response.json();
    return {
        data: data.data || [],
        pagination: data.pagination || { page, limit, total: 0, totalPages: 1 },
    };
};