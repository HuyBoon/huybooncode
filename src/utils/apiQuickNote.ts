import { QuickNoteType, PaginationType } from "@/types/interface";

interface FetchQuickNotesParams {
    page?: number;
    limit?: number;
    period?: string;
    date?: string;
    category?: string;
    dateTimeRange?: {
        start: string;
        end: string;
    };
}

export const fetchQuickNotes = async ({
    page = 1,
    limit = 10,
    period,
    date,
    category,
    dateTimeRange,
}: FetchQuickNotesParams): Promise<{ data: QuickNoteType[]; pagination: PaginationType }> => {
    const queryParams: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
    };

    if (period && period !== "all") {
        queryParams.period = period;
    }
    if (date) {
        queryParams.date = date;
    }
    if (category && category !== "all") {
        queryParams.category = category;
    }
    if (dateTimeRange) {
        queryParams["dateTimeRange[start]"] = dateTimeRange.start;
        queryParams["dateTimeRange[end]"] = dateTimeRange.end;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
    }

    const response = await fetch(`${baseUrl}/api/quicknotes?${queryString}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData || "Failed to fetch quick notes"}`);
    }

    const data = await response.json();
    return {
        data: data.data || [],
        pagination: data.pagination || { page, limit, total: 0, totalPages: 1 },
    };
};