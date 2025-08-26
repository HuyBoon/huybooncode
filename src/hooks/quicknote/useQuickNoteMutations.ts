"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuickNoteType, PaginationType, QuickNoteFilters } from "@/types/interface";

interface UseQuickNoteMutationsProps {
    setSnackbar: (options: { open: boolean; message: string; severity: "success" | "error" | "warning" }) => void;
    resetForm: () => void;
    pagination: PaginationType;
    quickNoteFilters: QuickNoteFilters;
}

export const useQuickNoteMutations = ({
    setSnackbar,
    resetForm,
    pagination,
    quickNoteFilters,
}: UseQuickNoteMutationsProps) => {
    const queryClient = useQueryClient();

    const addQuickNote = useMutation({
        mutationFn: async (data: { content: string; date: string; category: string }) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quicknotes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to add quick note");
            }
            return response.json() as Promise<QuickNoteType>;
        },
        onSuccess: () => {
            setSnackbar({ open: true, message: "Quick note added", severity: "success" });
            resetForm();
            queryClient.invalidateQueries({ queryKey: ["quickNotes"] });
        },
        onError: (error: any) => {
            setSnackbar({ open: true, message: error.message || "Failed to add quick note", severity: "error" });
        },
    });

    const updateQuickNote = useMutation({
        mutationFn: async (data: { id: string; content: string; date: string; category: string }) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quicknotes/${data.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: data.content, date: data.date, category: data.category }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to update quick note");
            }
            return response.json() as Promise<QuickNoteType>;
        },
        onSuccess: () => {
            setSnackbar({ open: true, message: "Quick note updated", severity: "success" });
            resetForm();
            queryClient.invalidateQueries({ queryKey: ["quickNotes"] });
        },
        onError: (error: any) => {
            setSnackbar({ open: true, message: error.message || "Failed to update quick note", severity: "error" });
        },
    });

    const deleteQuickNote = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quicknotes/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to delete quick note");
            }
            return response.json();
        },
        onSuccess: () => {
            setSnackbar({ open: true, message: "Quick note deleted", severity: "success" });
            resetForm();
            queryClient.invalidateQueries({ queryKey: ["quickNotes"] });
        },
        onError: (error: any) => {
            setSnackbar({ open: true, message: error.message || "Failed to delete quick note", severity: "error" });
        },
    });

    return {
        addQuickNote: addQuickNote.mutateAsync,
        updateQuickNote: updateQuickNote.mutateAsync,
        deleteQuickNote: deleteQuickNote.mutateAsync,
        isMutating: addQuickNote.isPending || updateQuickNote.isPending || deleteQuickNote.isPending,
    };
};