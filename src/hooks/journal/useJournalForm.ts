import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { MoodType } from "@/types/interface";

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

    const validate = (data: FormData) => {
        const newErrors: FormErrors = {};
        if (!data.title.trim()) newErrors.title = "Title is required";
        if (!data.content.trim()) newErrors.content = "Content is required";
        if (!data.mood) newErrors.mood = "Mood is required";
        if (!data.date || isNaN(new Date(data.date).getTime())) newErrors.date = "Valid date is required";
        return newErrors;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name as keyof FormData]: value }));
        setErrors((prev) => ({ ...prev, [name as keyof FormErrors]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate(formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                await onSubmit(formData);
            } catch (error: any) {
                setErrors({ content: error.message || "Failed to submit journal" });
            }
        }
    };

    return { formData, errors, handleSubmit, handleChange };
};