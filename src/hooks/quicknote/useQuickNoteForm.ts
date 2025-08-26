"use client";

import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material/Select";

interface FormData {
    id?: string;
    content: string;
    date: string;
    category: string;
}

interface FormErrors {
    content?: string;
    date?: string;
    category?: string;
}

interface UseQuickNoteFormProps {
    initialData?: FormData;
    onSubmit: (data: FormData) => Promise<void>;
}

export const useQuickNoteForm = ({ initialData, onSubmit }: UseQuickNoteFormProps) => {
    const defaultFormData: FormData = {
        content: "",
        date: new Date().toISOString().split("T")[0],
        category: "Work",
    };

    const [formData, setFormData] = useState<FormData>(initialData || defaultFormData);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(defaultFormData);
        }
    }, [initialData]);

    const validate = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.content.trim()) {
            newErrors.content = "Content is required";
        }
        if (!data.date || isNaN(new Date(data.date).getTime())) {
            newErrors.date = "Valid date is required";
        }
        if (!data.category || !["Work", "Personal", "Ideas", "To-Do"].includes(data.category)) {
            newErrors.category = "Valid category is required";
        }
        return newErrors;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        await onSubmit(formData);
        if (!formData.id) {
            setFormData(defaultFormData);
        }
    };

    const resetForm = () => {
        setFormData(defaultFormData);
        setErrors({});
    };

    return { formData, errors, handleChange, handleSubmit, resetForm };
};