import { TodoType, CategoryType, PaginationType } from "@/types/interface";

interface FetchTodosParams {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
    period?: string;
    notifyEnabled?: boolean;
    notificationSent?: boolean;
    dateTimeRange?: {
        start: string;
        end: string;
    };
}

interface FetchTodosResponse {
    data: TodoType[];
    pagination: PaginationType;
}

export const fetchTodos = async (params: FetchTodosParams = {}): Promise<FetchTodosResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.status && params.status !== "all") query.append("status", params.status);
    if (params.priority && params.priority !== "all") query.append("priority", params.priority);
    if (params.category && params.category !== "all") query.append("category", params.category);
    if (params.dueDate) query.append("dueDate", params.dueDate);
    if (params.period) query.append("period", params.period);
    if (params.notifyEnabled !== undefined) query.append("notifyEnabled", params.notifyEnabled.toString());
    if (params.notificationSent !== undefined) query.append("notificationSent", params.notificationSent.toString());
    if (params.dateTimeRange) {
        query.append("start", params.dateTimeRange.start);
        query.append("end", params.dateTimeRange.end);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";
    const response = await fetch(`${baseUrl}/api/todos?${query.toString()}`, {
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch todos");
    }

    return response.json();
};

export const fetchTodoCategories = async (): Promise<CategoryType[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";
    const response = await fetch(`${baseUrl}/api/categories`, {
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch categories");
    }

    return response.json();
};