import { FinanceType, FinanceCategoryType, PaginationType } from "@/types/interface";

export async function fetchCategories(): Promise<FinanceCategoryType[]> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance-categories`, {
            cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function fetchFinances({
    page = 1,
    limit = 10,
    period = "today",
    month,
    year,
    type,
    category,
    dayOfWeek,
}: {
    page?: number;
    limit?: number;
    period?: "today" | "yesterday" | "week" | "month" | "year";
    month?: number;
    year?: number;
    type?: string;
    category?: string;
    dayOfWeek?: "all" | number;
} = {}): Promise<{
    data: FinanceType[];
    pagination: PaginationType;
}> {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            period,
            ...(month && { month: month.toString() }),
            ...(year && { year: year.toString() }),
            ...(type && type !== "all" && { type }),
            ...(category && category !== "all" && { category }),
            ...(dayOfWeek && dayOfWeek !== "all" && { dayOfWeek: dayOfWeek.toString() }),
        });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance?${params}`, {
            cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch finances");
        const { finances, ...pagination } = await response.json();
        return {
            data: Array.isArray(finances) ? finances : [],
            pagination: {
                page: pagination.page || 1,
                limit: pagination.limit || 10,
                total: pagination.total || 0,
                totalPages: pagination.totalPages || 1,
            },
        };
    } catch (error) {
        console.error("Error fetching finances:", error);
        return {
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        };
    }
}

export async function fetchSummaryFinances({
    period = "today",
}: {
    period?: "today" | "yesterday" | "week" | "month" | "year";
}): Promise<FinanceType[]> {
    try {
        const params = new URLSearchParams({ period });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance?${params}`, {
            cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch summary finances");
        const { finances } = await response.json();
        return Array.isArray(finances) ? finances : [];
    } catch (error) {
        console.error("Error fetching summary finances:", error);
        return [];
    }
}

export async function addOrUpdateFinance(data: {
    id?: string | null;
    type: string;
    amount: number;
    category: string;
    description?: string;
    date: string;
}): Promise<FinanceType> {
    const url = data.id ? `/api/finance/${data.id}` : "/api/finance";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: data.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save finance");
    }
    return response.json();
}

export async function deleteFinance(id: string): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete finance");
    }
}