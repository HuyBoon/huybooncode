"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import BlogList from "@/components/blogs/BlogList";
import BlogForm from "@/components/blogs/BlogForm";
import { BlogType, CategoryType } from "@/types/interface";

export default function BlogsPage() {
	const [blogs, setBlogs] = useState<BlogType[]>([]);
	const [categories, setCategories] = useState<CategoryType[]>([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("/api/blogs");
				if (!res.ok) throw new Error("Failed to fetch blogs");
				const { data } = await res.json();
				setBlogs(data);

				const catRes = await fetch("/api/categories");
				if (!catRes.ok) {
					console.error("Failed to fetch categories:", await catRes.text());
					setCategories([]); // Fallback to empty array
					return;
				}
				const { data: catData } = await catRes.json();
				setCategories(catData || []);
			} catch (error) {
				console.error("Error fetching data:", error);
				setCategories([]); // Ensure categories is not undefined
			}
		};
		fetchData();
	}, []);

	const handleAddBlog = () => {
		setSelectedBlog(null);
		setIsFormOpen(true);
	};

	const handleEditBlog = async (id: string) => {
		try {
			const res = await fetch(`/api/blogs/${id}`);
			if (!res.ok) throw new Error("Failed to fetch blog");
			const blog = await res.json();
			setSelectedBlog(blog);
			setIsFormOpen(true);
		} catch (error) {
			console.error("Error fetching blog:", error);
		}
	};

	const handleSaveBlog = async (blog: Partial<BlogType>) => {
		try {
			const method = selectedBlog ? "PUT" : "POST";
			const url = selectedBlog ? `/api/blogs/${selectedBlog.id}` : "/api/blogs";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(blog),
			});
			if (!res.ok) throw new Error(`Failed to ${method.toLowerCase()} blog`);
			const savedBlog: BlogType = await res.json();
			setBlogs((prev) =>
				selectedBlog
					? prev.map((b) => (b.id === savedBlog.id ? savedBlog : b))
					: [...prev, savedBlog]
			);
			setIsFormOpen(false);
			setSelectedBlog(null);
		} catch (error) {
			console.error("Error saving blog:", error);
		}
	};

	const handleDeleteBlog = async (id: string) => {
		try {
			const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to delete blog");
			setBlogs((prev) => prev.filter((b) => b.id !== id));
		} catch (error) {
			console.error("Error deleting blog:", error);
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Blogs
			</Typography>
			<Button variant="contained" onClick={handleAddBlog} sx={{ mb: 2 }}>
				Add New Blog
			</Button>
			<BlogList
				blogs={blogs}
				onEdit={handleEditBlog}
				onDelete={handleDeleteBlog}
			/>
			<BlogForm />
		</Box>
	);
}
