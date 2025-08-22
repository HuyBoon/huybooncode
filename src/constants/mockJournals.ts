import { JournalType, PaginationType } from "@/types/interface";

export const mockJournals: JournalType[] = [
    {
        id: "mock1",
        title: "Sample Journal 1",
        content: "<p>This is a <b>sample</b> journal entry for testing.</p>",
        mood: "Happy",
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "mock2",
        title: "Sample Journal 2",
        content: "<p>Another <i>mock</i> journal to display when API fails.</p>",
        mood: "Calm",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockPagination: PaginationType = {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
};