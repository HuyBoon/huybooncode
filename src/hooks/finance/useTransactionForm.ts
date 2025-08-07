import { useState, useMemo, useEffect } from "react";
import { FinanceCategoryType, FinanceEntryType } from "@/types/interface";
import { formatNumber, unformatNumber } from "@/utils/helper";
import { useSnackbar } from "@/context/SnackbarContext";

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
    const { showSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        type: initialData?.type || ("expense" as FinanceEntryType),
        amount: initialData?.amount ? formatNumber(unformatNumber(initialData.amount)) : "",
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
        if (initialData) {
            const formattedAmount = initialData.amount
                ? formatNumber(unformatNumber(initialData.amount))
                : "";
            if (
                initialData.id !== formData.id ||
                initialData.type !== formData.type ||
                formattedAmount !== formData.amount ||
                initialData.category !== formData.category ||
                initialData.description !== formData.description ||
                initialData.date !== formData.date
            ) {
                setFormData({
                    id: initialData.id || null,
                    type: initialData.type || ("expense" as FinanceEntryType),
                    amount: formattedAmount,
                    category: initialData.category || "",
                    description: initialData.description || "",
                    date: initialData.date || new Date().toISOString().split("T")[0],
                });
                setErrors({});
            }
        } else {
            resetForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const parseAmount = (formatted: string) => {
        const digits = unformatNumber(formatted);
        if (!digits) return NaN;
        return parseInt(digits, 10);
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        const amount = parseAmount(formData.amount);

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
            showSnackbar({
                open: true,
                message: "Please fix the errors in the form",
                severity: "error",
            });
            return;
        }
        const amount = parseAmount(formData.amount);
        try {
            await onSubmit({
                id: formData.id,
                type: formData.type,
                amount,
                category: formData.category,
                description: formData.description || undefined,
                date: formData.date,
            });
            saveAmountToHistory(amount);
            showSnackbar({
                open: true,
                message: formData.id ? "Transaction updated successfully" : "Transaction added successfully",
                severity: "success",
            });
            resetForm();
        } catch (error: any) {
            setErrors({ amount: "Failed to submit transaction" });
            showSnackbar({
                open: true,
                message: "Failed to submit transaction",
                severity: "error",
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target as any;
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