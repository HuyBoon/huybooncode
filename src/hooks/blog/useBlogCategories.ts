import { useQuery } from "@tanstack/react-query";
import { BlogCategoryType } from "@/types/interface";
import { fetchBlogCategories } from "@/services/blogs/apiBlog";

interface UseBlogCategoriesResult {
    categories: BlogCategoryType[];
    isLoading: boolean;
    error: Error | null;
}

export const useBlogCategories = (initialCategories: BlogCategoryType[] = []): UseBlogCategoriesResult => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["blogCategories"],
        queryFn: fetchBlogCategories,
        initialData: initialCategories,
    });

    return {
        categories: Array.isArray(data) ? data : initialCategories,
        isLoading,
        error,
    };
};