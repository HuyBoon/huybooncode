import { UseMutationResult } from "@tanstack/react-query";
import { FinanceType, FinanceCategoryType, FinanceEntryType } from "@/types/interface";


export const handleAddOrUpdateFinance = (
    mutation: UseMutationResult<FinanceType, Error, any>,
    showSnackbar: (args: { open: boolean; message: string; severity: "success" | "error" }) => void,
    resetEdit?: () => void
) => {
    return async (data: {
        id: string | null;
        type: FinanceEntryType;
        amount: number;
        category: string;
        description?: string;
        date: string;
    }) => {
        try {
            await mutation.mutateAsync(data);
            showSnackbar({
                open: true,
                message: data.id ? "Finance updated successfully!" : "Finance added successfully!",
                severity: "success",
            });
            resetEdit?.();
        } catch (error) {
            showSnackbar({
                open: true,
                message: (error as Error).message || "Error saving finance",
                severity: "error",
            });
        }
    };
};
export const handleDeleteFinance = (
    mutation: UseMutationResult<void, Error, string>,
    showSnackbar: (args: { open: boolean; message: string; severity: "success" | "error" }) => void
) => {
    return async (id: string) => {
        try {
            await mutation.mutateAsync(id);
            showSnackbar({ open: true, message: "Finance deleted successfully!", severity: "success" });
        } catch (error) {
            showSnackbar({
                open: true,
                message: (error as Error).message || "Error deleting finance",
                severity: "error",
            });
        }
    };
};