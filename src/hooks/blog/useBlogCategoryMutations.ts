import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogCategoryType } from "@/types/interface";
import { v4 as uuidv4 } from "uuid";

interface FormData {
    id?: string;
    name: string;
}

interface UseBlogCategoryMutationsProps {
    setSnackbar: (options: { open: boolean; message: string; severity: "success" | "error" | "warning" }) => void;
    resetForm: () => void | Promise<void>;
}

interface UseBlogCategoryMutationsResult {
    addCategory: (formData: FormData) => Promise<BlogCategoryType>;
    updateCategory: (formData: FormData) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    isMutating: boolean;
}

export const useBlogCategoryMutations = ({
    setSnackbar,
    resetForm,
}: UseBlogCategoryMutationsProps): UseBlogCategoryMutationsResult => {
    const queryClient = useQueryClient();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

    const addCategoryMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${baseUrl}/api/blog-categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name.trim() }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add category");
            }
            return response.json();
        },
        onMutate: async (formData: FormData) => {
            await queryClient.cancelQueries({ queryKey: ["blogCategories"] });

            const previousCategories = queryClient.getQueryData<BlogCategoryType[]>(["blogCategories"]);

            const tempId = `temp-${uuidv4()}`;
            const optimisticCategory: BlogCategoryType = {
                id: tempId,
                name: formData.name.trim(),

            };

            queryClient.setQueryData(["blogCategories"], (oldData: BlogCategoryType[] | undefined) =>
                oldData ? [...oldData, optimisticCategory] : [optimisticCategory]
            );

            return { previousCategories };
        },
        onSuccess: async (newCategory: BlogCategoryType) => {
            queryClient.setQueryData(["blogCategories"], (oldData: BlogCategoryType[] | undefined) =>
                oldData
                    ? oldData.map((cat) => (cat.id === `temp-${uuidv4()}` ? newCategory : cat))
                    : [newCategory]
            );
            queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
            setSnackbar({
                open: true,
                message: "Category added!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any, formData, context) => {
            if (context?.previousCategories) {
                queryClient.setQueryData(["blogCategories"], context.previousCategories);
            }
            setSnackbar({
                open: true,
                message: error.message || "Error adding category",
                severity: "error",
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${baseUrl}/api/blog-categories/${formData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name.trim() }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update category");
            }
            return response.json();
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
            setSnackbar({
                open: true,
                message: "Category updated!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || "Error updating category",
                severity: "error",
            });
        },
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${baseUrl}/api/blog-categories/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete category");
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
            setSnackbar({
                open: true,
                message: "Category deleted!",
                severity: "success",
            });
            await Promise.resolve(resetForm());
        },
        onError: (error: any) => {
            setSnackbar({
                open: true,
                message: error.message || "Error deleting category",
                severity: "error",
            });
        },
    });

    return {
        addCategory: async (formData: FormData) => {
            return await addCategoryMutation.mutateAsync(formData);
        },
        updateCategory: async (formData: FormData) => {
            await updateCategoryMutation.mutateAsync(formData);
        },
        deleteCategory: async (id: string) => {
            await deleteCategoryMutation.mutateAsync(id);
        },
        isMutating:
            addCategoryMutation.isPending ||
            updateCategoryMutation.isPending ||
            deleteCategoryMutation.isPending,
    };
};