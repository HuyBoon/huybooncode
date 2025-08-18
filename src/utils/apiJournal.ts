import { JournalType } from "@/types/interface";

export const fetchJournals = async (filters: { period?: string; date?: string; mood?: string; page?: number; limit?: number } = {}) => {
    const url = new URL("/api/journal", window.location.origin);
    if (filters.period) url.searchParams.append("period", filters.period);
    if (filters.date) url.searchParams.append("date", filters.date);
    if (filters.mood) url.searchParams.append("mood", filters.mood);
    if (filters.page) url.searchParams.append("page", filters.page.toString());
    if (filters.limit) url.searchParams.append("limit", filters.limit.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error("Failed to fetch journals");
    }
    return (await response.json()) as { data: JournalType[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
};

export const fetchJournalById = async (id: string) => {
    const response = await fetch(`/api/journal/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch journal");
    }
    return (await response.json()) as JournalType;
};

export const addJournal = async (data: {
    title: string;
    content: string;
    mood: string;
    date: string;
}) => {
    const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to add journal");
    }
    return (await response.json()) as JournalType;
};

export const updateJournal = async (data: {
    id: string;
    title: string;
    content: string;
    mood: string;
    date: string;
}) => {
    const response = await fetch(`/api/journal/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to update journal");
    }
    return (await response.json()) as JournalType;
};

export const deleteJournal = async (id: string) => {
    const response = await fetch(`/api/journal/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete journal");
    }
    return await response.json();
};