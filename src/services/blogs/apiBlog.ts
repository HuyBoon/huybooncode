import { BlogType, BlogCategoryType, PaginationType } from "@/types/interface";

interface FetchBlogsParams {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    date?: string;
    period?: string;
}

export const fetchBlogs = async ({
    page = 1,
    limit = 10,
    status,
    category,
    date,
    period,
}: FetchBlogsParams): Promise<{ data: BlogType[]; pagination: PaginationType }> => {
    const query: { [key: string]: any } = {};

    if (status && status !== "all") query.status = status;
    if (category && category !== "all") query.blogcategory = category;
    if (date) {
        const [year, month] = date.split("-").map(Number);
        query.createdAt = {
            $gte: new Date(year, month - 1, 1).toISOString(),
            $lt: new Date(year, month, 1).toISOString(),
        };
    }
    if (period && period !== "all") {
        // Use UTC for consistency; adjust for user time zone if needed
        const now = new Date();
        if (period === "today") {
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            query.createdAt = {
                $gte: startOfDay.toISOString(),
                $lt: endOfDay.toISOString(),
            };
        } else if (period === "week") {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            query.createdAt = {
                $gte: startOfWeek.toISOString(),
                $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            };
        } else if (period === "month") {
            query.createdAt = {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
                $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
            };
        }
    }

    const queryString = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && status !== "all" ? { status } : {}),
        ...(category && category !== "all" ? { category } : {}),
        ...(date ? { date } : {}),
        ...(period && period !== "all" ? { period } : {}),
    }).toString();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?${queryString}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch blogs");
        }
        return response.json();
    } catch (error: any) {
        console.error("Error fetching blogs:", error.message);
        throw new Error(`Failed to fetch blogs: ${error.message}`);
    }
};

export const fetchBlogCategories = async (): Promise<BlogCategoryType[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog-categories`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch blog categories");
        }
        const data = await response.json();
        // Handle different response structures
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        if (data.categories && Array.isArray(data.categories)) return data.categories;
        console.warn("Unexpected response structure for blog categories:", data);
        return [];
    } catch (error: any) {
        console.error("Error fetching blog categories:", error.message);
        throw new Error(`Failed to fetch blog categories: ${error.message}`);
    }
};