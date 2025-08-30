export interface UserType {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    active: boolean;
    createdAt: string;
}

export interface PaginationType {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface FinanceType {
    id: string;
    type: "income" | "expense" | "saving" | "investment" | "debt" | "loan" | "other";
    amount: number;
    category: string;
    description?: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}
export type FinanceEntryType = "income" | "expense" | "saving" | "investment" | "debt" | "loan" | "other";

export interface FinanceCategoryType {
    id: string;
    name: string;
    type: "Income" | "Expense" | "Saving" | "Investment" | "Debt" | "Loan" | "Other";
    createdAt: string;
    updatedAt: string;
}

export interface TransactionFilters {
    month: number;
    year: number;
    type: "all" | "income" | "expense" | "saving" | "investment" | "debt" | "loan" | "other";
    category: string;
    dayOfWeek: "all" | number;
    period: "today" | "yesterday" | "week" | "month" | "year";
}

export interface SummaryFilters {
    period: "today" | "yesterday" | "week" | "month" | "year";
}

export interface JournalType {
    id: string;
    title: string;
    content: string;
    mood: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}


export interface MoodType {
    id: string;
    name: string;
    emoji: string;
}

export interface JournalFilters {
    period?: string;
    date?: string;
    mood?: string;
}
// TODO Types

export interface TodoType {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: "low" | "medium" | "high";
    category: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    notifyEnabled: boolean;
    notifyMinutesBefore: number;
    notificationSent: boolean;
}

export interface StatusType {
    id: string;
    name: string;
    icon: string;
}

export interface CategoryType {
    id: string;
    name: string;
}



export interface TodoFilters {
    dueDate: string;
    status: string;
    priority: string;
    category: string;
    period: string;
}

export interface SummaryToDoFilters {
    period: string;
}
export interface FetchTodosParams {
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
// Event Types

export interface EventType {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    todo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BlogType {
    id: string;
    title: string;
    slug: string;
    description: string;
    introductions: string;
    content: string;
    blogcategory: string;
    status: string;
    tags: string[];
    thumbnail: string;
    views: number;
    createdAt: string;
    updatedAt: string;
}

export interface BlogFilters {
    date: string;
    status: string;
    category: string;
    period: string;
}
export interface FormData {
    id?: string;
    title: string;
    slug: string;
    description: string;
    introductions: string;
    content: string;
    blogcategory: string;
    status: string;
    tags: string;
    thumbnail: string;
}
export interface FormErrors {
    title?: string;
    slug?: string;
    description?: string;
    introductions?: string;
    content?: string;
    blogcategory?: string;
    status?: string;
    tags?: string;
    thumbnail?: string;
}
export interface BlogCategoryType {
    id: string;
    name: string;
}

export interface BlogFilters {
    date: string;
    status: string;
    category: string;
    period: string;
}

export interface QuickNoteType {
    id: string;
    content: string;
    date: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export interface QuickNoteFilters {
    date?: string;
    period: string;
    category?: string;
}