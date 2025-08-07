import { TodoType, CategoryType, PaginationType } from "@/types/interface";

interface FetchTodosParams {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: string;
    dateTimeRange?: { start: string; end: string };
    period?: string;
    notifyEnabled?: boolean;
    notificationSent?: boolean;
}

export const fetchTodos = async ({
    page = 1,
    limit = 10,
    status,
    category,
    priority,
    dueDate,
    dateTimeRange,
    period,
    notifyEnabled,
    notificationSent,
}: FetchTodosParams): Promise<{ data: TodoType[]; pagination: PaginationType }> => {
    const query: { [key: string]: any } = {};

    if (status && status !== "all") query.status = status;
    if (category && category !== "all") query.category = category;
    if (priority) query.priority = priority;
    if (dueDate) {
        const [year, month] = dueDate.split("-").map(Number);
        query.dueDate = {
            $gte: new Date(year, month - 1, 1).toISOString(),
            $lt: new Date(year, month, 1).toISOString(),
        };
    }
    if (dateTimeRange) {
        query.dueDate = {
            $gte: new Date(dateTimeRange.start).toISOString(),
            $lte: new Date(dateTimeRange.end).toISOString(),
        };
    }
    if (period) {
        const now = new Date();
        if (period === "today") {
            query.dueDate = {
                $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
                $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString(),
            };
        } else if (period === "week") {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            query.dueDate = {
                $gte: startOfWeek.toISOString(),
                $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            };
        } else if (period === "month") {
            query.dueDate = {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
                $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
            };
        }
    }
    if (notifyEnabled !== undefined) query.notifyEnabled = notifyEnabled;
    if (notificationSent !== undefined) query.notificationSent = notificationSent;

    const queryString = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && status !== "all" ? { status } : {}),
        ...(category && category !== "all" ? { category } : {}),
        ...(priority ? { priority } : {}),
        ...(dueDate ? { dueDate } : {}),
        ...(dateTimeRange ? { dateTimeRange: JSON.stringify(dateTimeRange) } : {}),
        ...(notifyEnabled !== undefined ? { notifyEnabled: notifyEnabled.toString() } : {}),
        ...(notificationSent !== undefined ? { notificationSent: notificationSent.toString() } : {}),
    }).toString();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos?${queryString}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch todos");
    }
    return response.json();
};

export const fetchTodoCategories = async (): Promise<CategoryType[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch categories");
    }
    return response.json();
};