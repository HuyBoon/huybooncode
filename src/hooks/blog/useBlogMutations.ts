import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogType, PaginationType, BlogFilters, FormData } from "@/types/interface";
import { v4 as uuidv4 } from "uuid";

interface QueryData {
    data: BlogType[];
    pagination: PaginationType;
}

interface UseBlogMutationsResult {
    addBlog: (formData: FormData) => Promise<BlogType>;
    updateBlog: (formData: FormData) => Promise<BlogType>;
    deleteBlog: (id: string) => Promise<void>;
    isMutating: boolean;
}

interface UseBlogMutationsProps {
    setSnackbar: (options: { open: boolean; message: string; severity: "success" | "error" | "warning" }) => void;
    resetForm: () => void | Promise<void>;
    pagination?: PaginationType;
    blogFilters?: BlogFilters;
}

export const useBlogMutations = ({
    setSnackbar,
    resetForm,
    pagination,
    blogFilters,
}: UseBlogMutationsProps): UseBlogMutationsResult => {
    const queryClient = useQueryClient();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

    const addBlogMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const { id, ...data } = formData;
            const response = await fetch(`${baseUrl}/api/blogs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag) : [],
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add blog");
            }
            return response.json();
        },
        onMutate: async (formData: FormData) => {
            await queryClient.cancelQueries({ queryKey: ["blogs", blogFilters] });
            const previousBlogs = queryClient.getQueryData<QueryData>(["blogs", blogFilters]);

            const tempId = `temp-${uuidv4()}`;
            const now = new Date().toISOString();
            const optimisticBlog: BlogType = {
                id: tempId,
                title: formData.title,
                slug: formData.slug,
                description: formData.description || "",
                introductions: formData.introductions || "",
                content: formData.content,
                blogcategory: formData.blogcategory,
                status: formData.status || "draft",
                tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag) : [],
                thumbnail: formData.thumbnail || "",
                views: 0,
                createdAt: now,
                updatedAt: now,
            };

            queryClient.setQueryData(["blogs", blogFilters], (oldData: QueryData | undefined) => {
                if (!oldData) {
                    return {
                        data: [optimisticBlog],
                        pagination: { page: 1, limit: pagination?.limit || 10, total: 1, totalPages: 1 },
                    };
                }
                return {
                    ...oldData,
                    data: [optimisticBlog, ...oldData.data],
                    pagination: {
                        ...oldData.pagination,
                        total: oldData.pagination.total + 1,
                        totalPages: Math.ceil((oldData.pagination.total + 1) / oldData.pagination.limit),
                    },
                };
            });

            return { previousBlogs };
        },
        onSuccess: async (newBlog: BlogType) => {
            queryClient.setQueryData(["blogs", blogFilters], (oldData: QueryData | undefined) => {
                if (!oldData) {
                    return {
                        data: [newBlog],
                        pagination: { page: 1, limit: pagination?.limit || 10, total: 1, totalPages: 1 },
                    };
                }
                return {
                    ...oldData,
                    data: oldData.data.map((blog) => (blog.id.startsWith("temp-") ? newBlog : blog)),
                };
            });
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            setSnackbar({ open: true, message: "Blog added successfully", severity: "success" });
            await Promise.resolve(resetForm());
        },
        onError: (error: any, _, context) => {
            if (context?.previousBlogs) {
                queryClient.setQueryData(["blogs", blogFilters], context.previousBlogs);
            }
            setSnackbar({ open: true, message: error.message || "Failed to add blog", severity: "error" });
        },
    });

    const updateBlogMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const { id, ...data } = formData;
            if (!id) throw new Error("Blog ID is required");
            const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag) : [],
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update blog");
            }
            return response.json();
        },
        onMutate: async (formData: FormData) => {
            await queryClient.cancelQueries({ queryKey: ["blogs", blogFilters] });
            const previousBlogs = queryClient.getQueryData<QueryData>(["blogs", blogFilters]);

            queryClient.setQueryData(["blogs", blogFilters], (oldData: QueryData | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((blog) =>
                        blog.id === formData.id
                            ? {
                                ...blog,
                                title: formData.title,
                                slug: formData.slug,
                                description: formData.description || "",
                                introductions: formData.introductions || "",
                                content: formData.content,
                                blogcategory: formData.blogcategory,
                                status: formData.status || "draft",
                                tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag) : [],
                                thumbnail: formData.thumbnail || "",
                                updatedAt: new Date().toISOString(),
                            }
                            : blog
                    ),
                };
            });

            return { previousBlogs };
        },
        onSuccess: async (updatedBlog: BlogType) => {
            queryClient.setQueryData(["blogs", blogFilters], (oldData: QueryData | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)),
                };
            });
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            setSnackbar({ open: true, message: "Blog updated successfully", severity: "success" });
            await Promise.resolve(resetForm());
        },
        onError: (error: any, _, context) => {
            if (context?.previousBlogs) {
                queryClient.setQueryData(["blogs", blogFilters], context.previousBlogs);
            }
            setSnackbar({ open: true, message: error.message || "Failed to update blog", severity: "error" });
        },
    });

    const deleteBlogMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete blog");
            }
            return response.json();
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["blogs", blogFilters] });
            const previousBlogs = queryClient.getQueryData<QueryData>(["blogs", blogFilters]);

            queryClient.setQueryData(["blogs", blogFilters], (oldData: QueryData | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter((blog) => blog.id !== id),
                    pagination: {
                        ...oldData.pagination,
                        total: oldData.pagination.total - 1,
                        totalPages: Math.ceil((oldData.pagination.total - 1) / oldData.pagination.limit),
                    },
                };
            });

            return { previousBlogs };
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            setSnackbar({ open: true, message: "Blog deleted successfully", severity: "success" });
            await Promise.resolve(resetForm());
        },
        onError: (error: any, _, context) => {
            if (context?.previousBlogs) {
                queryClient.setQueryData(["blogs", blogFilters], context.previousBlogs);
            }
            setSnackbar({ open: true, message: error.message || "Failed to delete blog", severity: "error" });
        },
    });

    return {
        addBlog: addBlogMutation.mutateAsync,
        updateBlog: updateBlogMutation.mutateAsync,
        deleteBlog: deleteBlogMutation.mutateAsync,
        isMutating: addBlogMutation.isPending || updateBlogMutation.isPending || deleteBlogMutation.isPending,
    };
};