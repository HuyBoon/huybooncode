import { useState, useEffect } from "react";
import { BlogCategoryType, FormData } from "@/types/interface";

interface UseBlogFormProps {
    categories: BlogCategoryType[];
    initialData?: FormData;
    onSubmit: (data: FormData) => Promise<void>;
}

interface FormErrors {
    title?: string;
    slug?: string;
    description?: string;
    introductions?: string;
    content?: string;
    blogcategory?: string;
    status?: string;
    tags?: string;
    thumbnail?: string;
}

export const useBlogForm = ({ categories, initialData, onSubmit }: UseBlogFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        slug: "",
        description: "",
        introductions: "",
        content: "",
        blogcategory: categories[0]?.id || "",
        status: "draft",
        tags: "",
        thumbnail: "",
        ...(initialData || {}),
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        console.log("useBlogForm Initial Data:", initialData); // Log initialData
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                ...initialData,
                blogcategory: initialData.blogcategory || categories[0]?.id || "",
                status: initialData.status || "draft",
                description: initialData.description || "",
                introductions: initialData.introductions || "",
                thumbnail: initialData.thumbnail || "",
            }));
        }
    }, [initialData, categories]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | import("@mui/material").SelectChangeEvent<string>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.slug.trim()) newErrors.slug = "Slug is required";
        if (!formData.content.trim()) newErrors.content = "Content is required";
        if (!formData.blogcategory || !categories.some((c) => c.id === formData.blogcategory)) {
            newErrors.blogcategory = "Valid category is required";
        }
        if (!["draft", "published", "archived"].includes(formData.status)) {
            newErrors.status = "Valid status is required";
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        await onSubmit(formData);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            description: "",
            introductions: "",
            content: "",
            blogcategory: categories[0]?.id || "",
            status: "draft",
            tags: "",
            thumbnail: "",
        });
        setErrors({});
    };

    return { formData, errors, handleChange, handleSubmit, resetForm };
};