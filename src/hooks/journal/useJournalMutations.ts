import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addJournal, updateJournal, deleteJournal } from "@/utils/apiJournal";
import { JournalType, MoodType, PaginationType } from "@/types/interface";

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
    addJournal: (formData: FormData) => Promise<void>;
    updateJournal: (formData: FormData) => Promise<void>;
    deleteJournal: (id: string) => Promise<void>;
    isMutating: boolean;
}

export const useJournalMutations = (
    setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" | "warning" }) => void,
    resetForm: () => void,
    moods: MoodType[]
): UseJournalMutationsResult => {
    const queryClient = useQueryClient();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

    const addJournalMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${baseUrl}/api/journal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add journal");
            }
            return response.json();
        },
        onSuccess: (newJournal: JournalType) => {
            queryClient.invalidateQueries({ queryKey: ["journals"] });
            setSnackbar({
                open: true,
                message: "Journal added!",
                severity: "success",
            });
            resetForm();
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || "Error adding journal",
                severity: "error",
            });
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
        onSuccess: (updatedJournal: JournalType) => {
            queryClient.invalidateQueries({ queryKey: ["journals"] });
            setSnackbar({
                open: true,
                message: "Journal updated!",
                severity: "success",
            });
            resetForm();
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["journals"] });
            setSnackbar({
                open: true,
                message: "Journal deleted!",
                severity: "success",
            });
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
            await addJournalMutation.mutateAsync(formData);
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