
export interface UserType {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    active: boolean;
    createdAt: Date;
}

export interface Finance {
    id: string;
    userId: string;
    type: "income" | "expense";
    amount: number;
    category: string; // References FinanceCategory _id
    categoryName?: string; // Populated name for display
    description?: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface FinanceCategory {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}