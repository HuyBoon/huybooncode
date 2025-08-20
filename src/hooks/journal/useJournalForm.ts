import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { MoodType } from "@/types/interface";
import sanitizeHtml from "sanitize-html";

interface FormData {
    id?: string;
    title: string;
    content: string;
    mood: string;
    date: string;
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
    const [formData, setFormData] = useState<FormData>(
        initialData || {
            title: "",
            content: "",
            mood: moods[0]?.name || "",
            date: new Date().toISOString().slice(0, 16),
        }
    );
    const [errors, setErrors] = useState<FormErrors>({});

    // Update formData when initialData changes (e.g., for editing)
    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id,
                title: initialData.title,
                content: initialData.content,
                mood: initialData.mood,
                date: initialData.date,
            });
        }
    }, [initialData?.id, initialData?.title, initialData?.content, initialData?.mood, initialData?.date]);

    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};

        if (!data.title.trim()) {
            newErrors.title = "Title is required";
        }
        const strippedContent = sanitizeHtml(data.content, { allowedTags: [] }).trim();
        if (!strippedContent) {
            newErrors.content = "Content is required";
        }
        if (!data.mood || !moods.some((m) => m.name === data.mood)) {
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
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await onSubmit(formData);
                setFormData({
                    title: "",
                    content: "",
                    mood: moods[0]?.name || "",
                    date: new Date().toISOString().slice(0, 16),
                });
                setErrors({});
            } catch (error: any) {
                setErrors({ content: error.message || "Failed to submit journal" });
            }
        }
    };

    return {
        formData,
        errors,
        handleChange,
        handleSubmit,
    };
};