import { useState, useMemo } from "react";
import { FinanceCategoryType, FinanceEntryType } from "@/types/interface";

interface UseTransactionFormNewProps {
    categories: FinanceCategoryType[];
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

export const useTransactionFormNew = ({ categories, onSubmit }: UseTransactionFormNewProps) => {
    const [formData, setFormData] = useState({
        id: null,
        type: "expense" as FinanceEntryType,
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const filteredCategories = useMemo(() => {
        console.log("categories in useTransactionFormNew:", categories);
        console.log("formData.type:", formData.type);

        // Validate categories and formData.type
        if (!formData.type || !categories || categories.length === 0) {
            console.warn("No valid categories or type:", { categories, type: formData.type });
            return [];
        }

        return categories.filter((cat) => {
            if (!cat.type || typeof cat.type !== "string") {
                console.warn("Invalid category type:", cat);
                return false;
            }
            return cat.type.toLowerCase() === formData.type.toLowerCase();
        });
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
        filteredCategories,
        handleSubmit,
        handleChange,
        handleCategoryChange,
        handleTypeChange,
        resetForm,
    };
};