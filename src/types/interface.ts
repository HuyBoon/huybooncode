export interface UserType {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    active: boolean;
    createdAt: Date;
}

export interface FinanceType {
    id: string;
    type:
    | "income"
    | "expense"
    | "saving"
    | "investment"
    | "debt"
    | "loan"
    | "other";
    amount: number;
    category: string;
    categoryName?: string;
    description?: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}



export interface FinanceCategoryType {
    id: string;
    name: string;
    type: "Income" | "Expense" | "Saving" | "Investment" | "Debt" | "Loan" | "Other";
    createdAt: string;
    updatedAt: string;
}

export interface JournalType {
    id: string;
    title: string;
    content: string;
    mood: string;
    date: string; // ISO date string (e.g., "2025-07-20")
    createdAt: string;
    updatedAt: string;
}

export interface MoodType {
    id: string;
    name: string; // e.g., "Happy", "Sad", "Neutral"
    emoji: string; // e.g., "😊", "😢", "😐"
}

export interface TodoType {
    id: string;
    title: string;
    description: string;
    status: string; // References StatusType.id (MongoDB ObjectId)
    priority: "low" | "medium" | "high";
    category: string; // References CategoryType.id
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
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

export interface EventType {
    id: string;
    title: string;
    description: string;
    start: string; // ISO date string (e.g., "2025-07-21T10:00:00.000Z")
    end: string; // ISO date string (e.g., "2025-07-21T11:00:00.000Z")
    todo?: string; // References TodoType.id (MongoDB ObjectId)
    createdAt: string;
    updatedAt: string;
}

export interface CategoryBlogType {
    id: string;
    name: string;
}
export interface BlogType {
    id: string;
    title: string;
    slug: string;
    description: string;
    introductions: string;
    blogcategory: string; // References CategoryType.id
    thumbnail: string;
    content: string;
    status: "draft" | "published" | "archived";
    tags: string[];
    author?: string; // References UserType._id
    views: number;
    createdAt: string;
    updatedAt: string;
}