import { useState, useMemo, useEffect } from "react";
import { FinanceCategoryType, FinanceEntryType } from "@/types/interface";

interface UseTransactionFormProps {
    categories: FinanceCategoryType[];
    initialData?: {
        id: string | null;
        type: FinanceEntryType;
        amount: string;
        category: string;
        description: string;
        date: string;
    };
    onSubmit: (data: {
        id: string | null;
        type: FinanceEntryType;
        amount: number;
        category: string;
        description?: string;
        date: string;
    }) => Promise<void>;
}

interface FormErrors {
    type?: string;
    amount?: string;
    category?: string;
    date?: string;
    description?: string;
}

export const useTransactionForm = ({ categories, initialData, onSubmit }: UseTransactionFormProps) => {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        type: initialData?.type || ("expense" as FinanceEntryType),
        amount: initialData?.amount || "",
        category: initialData?.category || "",
        description: initialData?.description || "",
        date: initialData?.date || new Date().toISOString().split("T")[0],
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const [amountHistory, setAmountHistory] = useState<number[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("financeAmountHistory");
            return saved ? JSON.parse(saved) : [30000, 100000];
        }
        return [30000, 100000];
    });

    useEffect(() => {
        console.log("initialData trong useTransactionForm:", initialData);
        if (initialData) {
            if (
                initialData.id !== formData.id ||
                initialData.type !== formData.type ||
                initialData.amount !== formData.amount ||
                initialData.category !== formData.category ||
                initialData.description !== formData.description ||
                initialData.date !== formData.date
            ) {
                setFormData({
                    id: initialData.id || null,
                    type: initialData.type || ("expense" as FinanceEntryType),
                    amount: initialData.amount || "",
                    category: initialData.category || "",
                    description: initialData.description || "",
                    date: initialData.date || new Date().toISOString().split("T")[0],
                });
                setErrors({});
            }
        } else {
            resetForm();
        }
    }, [initialData]);

    const saveAmountToHistory = (amount: number) => {
        if (isNaN(amount) || amount <= 0) return;
        const updatedHistory = Array.from(new Set([amount, ...amountHistory])).slice(0, 10);
        setAmountHistory(updatedHistory);
        if (typeof window !== "undefined") {
            localStorage.setItem("financeAmountHistory", JSON.stringify(updatedHistory));
        }
    };

    const filteredCategories = useMemo(() => {
        return categories.filter((cat) => cat.type.toLowerCase() === formData.type.toLowerCase());
    }, [categories, formData.type]);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        const amount = parseFloat(formData.amount);

        if (!formData.type) {
            newErrors.type = "Type is required";
        }
        if (isNaN(amount) || amount <= 0) {
            newErrors.amount = "Amount must be a positive number";
        }
        if (!formData.category || !categories.find((cat) => cat.id === formData.category)) {
            newErrors.category = "Valid category is required";
        }
        if (!formData.date || isNaN(new Date(formData.date).getTime())) {
            newErrors.date = "Valid date is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const amount = parseFloat(formData.amount);
        const data = { ...formData, amount, description: formData.description || undefined };
        await onSubmit(data);
        saveAmountToHistory(amount);
        resetForm();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name as string]: value }));
        setErrors((prev) => ({ ...prev, [name as string]: undefined }));
    };

    const handleCategoryChange = (categoryId: string) => {
        setFormData((prev) => ({ ...prev, category: categoryId }));
        setErrors((prev) => ({ ...prev, category: undefined }));
    };

    const handleTypeChange = (type: FinanceEntryType) => {
        setFormData((prev) => ({ ...prev, type, category: "" }));
        setErrors((prev) => ({ ...prev, type: undefined, category: undefined }));
    };

    const resetForm = () => {
        setFormData({
            id: null,
            type: "expense" as FinanceEntryType,
            amount: "",
            category: "",
            description: "",
            date: new Date().toISOString().split("T")[0],
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        setFormData,
        amountHistory,
        filteredCategories,
        handleSubmit,
        handleChange,
        handleCategoryChange,
        handleTypeChange,
        resetForm,
    };
};