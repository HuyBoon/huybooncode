
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
    type: "income" | "expense";
    amount: number;
    category: string; // References FinanceCategory _id
    categoryName?: string; // Populated name for display
    description?: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface FinanceCategoryType {
    id: string;
    name: string;
    type: "Income" | "Expense" | "Other";
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