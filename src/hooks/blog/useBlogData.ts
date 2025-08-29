import { useQuery } from "@tanstack/react-query";
import { fetchBlogs, fetchBlogCategories } from "@/services/blogs/apiBlog";
import { BlogType, BlogCategoryType, PaginationType, BlogFilters } from "@/types/interface";

interface UseBlogDataProps {
    initialBlogs: BlogType[];
    initialCategories: BlogCategoryType[];
    initialPagination: PaginationType;
    pagination: PaginationType;
    filters: BlogFilters;
}

export const useBlogData = ({
    initialBlogs,
    initialCategories,
    initialPagination,
    pagination,
    filters,
}: UseBlogDataProps) => {
    const { data: blogsData, isLoading: isBlogsLoading } = useQuery({
        queryKey: ["blogs", pagination.page, pagination.limit, filters],
        queryFn: () =>
            fetchBlogs({
                page: pagination.page,
                limit: pagination.limit,
                status: filters.status !== "all" ? filters.status : undefined,
                date: filters.date,
                category: filters.category !== "all" ? filters.category : undefined,
            }),
        initialData: { data: initialBlogs, pagination: initialPagination },
    });

    const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ["blogCategories"],
        queryFn: fetchBlogCategories,
        initialData: initialCategories,
    });

    return {
        blogs: blogsData.data,
        categories: categoriesData,
        isLoading: isBlogsLoading || isCategoriesLoading,
        pagination: blogsData.pagination,
    };
};