
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