import { useState, useEffect } from "react";
import { TodoType, StatusType, CategoryType } from "@/types/interface";
import { useSnackbar } from "@/context/SnackbarContext";
import { ChangeEvent } from "react";

interface UseTodoFormProps {
    statuses: StatusType[];
    categories: CategoryType[];
    initialData?: {
        id: string | null;
        title: string;
        description: string;
        status: string;
        priority: "low" | "medium" | "high";
        category: string;
        dueDate: string;
        notifyEnabled: boolean;
        notifyMinutesBefore: number;
    };
    onSubmit: (data: {
        id: string; // Đổi từ string | null thành string
        title: string;
        description: string;
        status: string;
        priority: "low" | "medium" | "high";
        category: string;
        dueDate: string;
        notifyEnabled: boolean;
        notifyMinutesBefore: number;
    }) => Promise<void>;
}

interface FormErrors {
    title?: string;
    status?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
    description?: string;
    notifyMinutesBefore?: string;
}

export const useTodoForm = ({ statuses, categories, initialData, onSubmit }: UseTodoFormProps) => {
    const { showSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        title: initialData?.title || "",
        description: initialData?.description || "",
        status: initialData?.status || (statuses.length > 0 ? statuses[0].name : "Pending"),
        priority: initialData?.priority || ("medium" as "low" | "medium" | "high"),
        category: initialData?.category || (categories.length > 0 ? categories[0].id : ""),
        dueDate: initialData?.dueDate || new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
        notifyEnabled: initialData?.notifyEnabled ?? true,
        notifyMinutesBefore: initialData?.notifyMinutesBefore ?? 15,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id || null,
                title: initialData.title || "",
                description: initialData.description || "",
                status: initialData.status || (statuses.length > 0 ? statuses[0].name : "Pending"),
                priority: initialData.priority || "medium",
                category: initialData.category || (categories.length > 0 ? categories[0].id : ""),
                dueDate: initialData.dueDate || new Date().toISOString().slice(0, 16),
                notifyEnabled: initialData.notifyEnabled ?? true,
                notifyMinutesBefore: initialData.notifyMinutesBefore ?? 15,
            });
            setErrors({});
        } else {
            resetForm();
        }
    }, [initialData, statuses, categories]);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.title || !formData.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!formData.status || !["Pending", "In Progress", "Completed"].includes(formData.status)) {
            newErrors.status = "Valid status is required";
        }
        if (!formData.priority || !["low", "medium", "high"].includes(formData.priority)) {
            newErrors.priority = "Valid priority is required";
        }
        if (!formData.category || !categories.find((cat) => cat.id === formData.category)) {
            newErrors.category = "Valid category is required";
        }
        if (!formData.dueDate || isNaN(new Date(formData.dueDate).getTime())) {
            newErrors.dueDate = "Valid due date and time is required";
        }
        if (formData.notifyEnabled && (formData.notifyMinutesBefore < 0 || isNaN(formData.notifyMinutesBefore))) {
            newErrors.notifyMinutesBefore = "Notification time must be a non-negative number";
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
        try {
            // Đảm bảo id là string trước khi gọi onSubmit
            const submitData = {
                ...formData,
                id: formData.id || `temp-${Date.now()}`, // Gán id tạm nếu null
            };
            await onSubmit(submitData);
            showSnackbar({
                open: true,
                message: formData.id ? "Todo updated successfully" : "Todo added successfully",
                severity: "success",
            });
            resetForm();
        } catch (error: any) {
            setErrors({ title: "Failed to submit todo" });
            showSnackbar({
                open: true,
                message: error.message || "Failed to submit todo",
                severity: "error",
            });
        }
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown } }
    ) => {
        const { name, value } = e.target;
        if (name) {
            setFormData((prev) => ({
                ...prev,
                [name]: name === "notifyEnabled" ? value === true : name === "notifyMinutesBefore" ? Number(value) : value,
            }));
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            title: "",
            description: "",
            status: statuses.length > 0 ? statuses[0].name : "Pending",
            priority: "medium",
            category: categories.length > 0 ? categories[0].id : "",
            dueDate: new Date().toISOString().slice(0, 16),
            notifyEnabled: true,
            notifyMinutesBefore: 15,
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        setFormData,
        handleSubmit,
        handleChange,
        resetForm,
    };
};