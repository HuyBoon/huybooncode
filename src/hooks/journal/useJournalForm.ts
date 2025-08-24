"use client";

import { useState, useEffect } from "react";
import { MoodType } from "@/types/interface";
import { SelectChangeEvent } from "@mui/material/Select";

interface FormData {
    id?: string;
    title: string;
    content: string;
    mood: string;
    date: string; // Format: YYYY-MM-DD
}

interface FormErrors {
    title?: string;
    content?: string;
    mood?: string;
    date?: string;
}

interface UseJournalFormProps {
    moods: MoodType[];
    initialData?: FormData;
    onSubmit: (data: FormData) => Promise<void>;
}

export const useJournalForm = ({ moods, initialData, onSubmit }: UseJournalFormProps) => {
    const defaultFormData: FormData = {
        title: "",
        content: "",
        mood: moods[0]?.name || "",
        date: new Date().toISOString().split("T")[0], // Default to today
    };

    const [formData, setFormData] = useState<FormData>(initialData || defaultFormData);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(defaultFormData);
        }
    }, [initialData, moods]);

    const validate = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!data.content.trim()) {
            newErrors.content = "Content is required";
        }
        if (!data.mood || !moods.some((mood) => mood.name === data.mood)) {
            newErrors.mood = "Valid mood is required";
        }
        if (!data.date || isNaN(new Date(data.date).getTime())) {
            newErrors.date = "Valid date is required";
        }
        return newErrors;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
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
            setFormData(defaultFormData); // Reset after successful add
        }
    };

    const resetForm = () => {
        setFormData(defaultFormData);
        setErrors({});
    };

    return { formData, errors, handleChange, handleSubmit, resetForm };
};