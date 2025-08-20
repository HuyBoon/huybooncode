import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JournalType, MoodType, PaginationType, JournalFilters } from "@/types/interface";
import { v4 as uuidv4 } from "uuid";

interface FormData {
    id?: string;
    title: string;
    content: string;
    mood: string;
    date: string;
}

interface QueryData {
    data: JournalType[];
    pagination: PaginationType;
}

interface UseJournalMutationsResult {
    addJournal: (formData: FormData) => Promise<JournalType>;
    updateJournal: (formData: FormData) => Promise<void>;
    deleteJournal: (id: string) => Promise<void>;
    isMutating: boolean;
}

interface UseJournalMutationsProps {
    setSnackbar: (snackbar: {
        open: boolean;
        message: string;
        severity: "success" | "error" | "warning";
    }) => void;
    resetForm: () => void | Promise<void>;
    moods: MoodType[];
    pagination?: PaginationType;
    journalFilters?: JournalFilters;
}

export const useJournalMutations = ({
    setSnackbar,
    resetForm,
    moods,
    pagination,
    journalFilters,
}: UseJournalMutationsProps): UseJournalMutationsResult => {
    const queryClient = useQueryClient();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

    const addJournalMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const { id, ...data } = formData;
            const response = await fetch(`${baseUrl}/api/journal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add journal");
            }
            return response.json();
        },
        onMutate: async (formData: FormData) => {
            await queryClient.cancelQueries({ queryKey: ["journals", pagination?.page, pagination?.limit, journalFilters] });

            const previousJournals = queryClient.getQueryData<QueryData>(["journals", pagination?.page, pagination?.limit, journalFilters]);

            const tempId = `temp-${uuidv4()}`;
            const now = new Date().toISOString();
            const optimisticJournal: JournalType = {
                id: tempId,
                title: formData.title,
                content: formData.content,
                mood: formData.mood,
                date: formData.date,
                createdAt: now,
                updatedAt: now,
            };

            queryClient.setQueryData(
                ["journals", pagination?.page, pagination?.limit, journalFilters],
                (oldData: QueryData | undefined) => {
                    if (!oldData) {
                        return {
                            data: [optimisticJournal],
                            pagination: { page: 1, limit: pagination?.limit || 10, total: 1, totalPages: 1 },
                        };
                    }
                    return {
                        ...oldData,
                        data: [optimisticJournal, ...oldData.data],
                        pagination: {
                            ...oldData.pagination,
                            total: oldData.pagination.total + 1,
                            totalPages: Math.ceil((oldData.pagination.total + 1) / oldData.pagination.limit),
                        },
                    };
                }
            );

            return { previousJournals };
        },
        onSuccess: async (newJournal: JournalType) => {
            queryClient.setQueryData(
                ["journals", pagination?.page, pagination?.limit, journalFilters],
                (oldData: QueryData | undefined) => {
                    if (!oldData) {
                        return {
                            data: [newJournal],
                            pagination: { page: 1, limit: pagination?.limit || 10, total: 1, totalPages: 1 },
                        };
                    }
                    return {
                        ...oldData,
                        data: oldData.data.map((journal) =>
                            journal.id.startsWith("temp-") ? { ...journal, ...newJournal, id: newJournal.id } : journal
                        ),
                        pagination: {
                            ...oldData.pagination,
                            total: oldData.pagination.total,
                            totalPages: oldData.pagination.totalPages,
                        },
                    };
                }
            );

            queryClient.invalidateQueries({ queryKey: ["journals"] });
            setSnackbar({
                open: true,
                message: "Journal added!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any, formData, context) => {
            if (context?.previousJournals) {
                queryClient.setQueryData(
                    ["journals", pagination?.page, pagination?.limit, journalFilters],
                    context.previousJournals
                );
            }
            setSnackbar({
                open: true,
                message: error.message || "Error adding journal",
                severity: "error",
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["journals"] });
        },
    });

    const updateJournalMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${baseUrl}/api/journal/${formData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update journal");
            }
            return response.json();
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["journals"] });
            setSnackbar({
                open: true,
                message: "Journal updated!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || "Error updating journal",
                severity: "error",
            });
        },
    });

    const deleteJournalMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${baseUrl}/api/journal/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete journal");
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["journals"] });
            setSnackbar({
                open: true,
                message: "Journal deleted!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || "Error deleting journal",
                severity: "error",
            });
        },
    });

    return {
        addJournal: async (formData: FormData) => {
            return await addJournalMutation.mutateAsync(formData);
        },
        updateJournal: async (formData: FormData) => {
            await updateJournalMutation.mutateAsync(formData);
        },
        deleteJournal: async (id: string) => {
            await deleteJournalMutation.mutateAsync(id);
        },
        isMutating:
            addJournalMutation.isPending ||
            updateJournalMutation.isPending ||
            deleteJournalMutation.isPending,
    };
};