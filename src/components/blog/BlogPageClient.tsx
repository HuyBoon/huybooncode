"use client";
import React, { useState, useEffect, useMemo } from "react";
import { CircularProgress, Box, Button, Typography } from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext";
import {
	BlogType,
	BlogCategoryType,
	PaginationType,
	BlogFilters,
} from "@/types/interface";
import { useBlogData } from "@/hooks/blog/useBlogData";
import { useBlogMutations } from "@/hooks/blog/useBlogMutations";
import { useBlogForm } from "@/hooks/blog/useBlogForm";
import BlogLayout from "@/components/blog/BlogLayout";

interface BlogPageClientProps {
	initialBlogs: BlogType[];
	initialCategories: BlogCategoryType[];
	initialPagination: PaginationType;
	initialError: string | null;
}

const BlogPageClient: React.FC<BlogPageClientProps> = ({
	initialBlogs,
	initialCategories,
	initialPagination,
	initialError,
}) => {
	const { showSnackbar } = useSnackbar();
	const [filters, setFilters] = useState<BlogFilters>({
		date: "",
		status: "all",
		category: "all",
		period: "all",
	});
	const [pagination, setPagination] = useState<PaginationType>({
		...initialPagination,
		page: 1,
		limit: initialPagination.limit || 10,
	});
	const [editBlog, setEditBlog] = useState<BlogType | undefined>(undefined);
	const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(null);

	const {
		blogs,
		categories,
		isLoading,
		pagination: serverPagination,
	} = useBlogData({
		initialBlogs,
		initialCategories,
		initialPagination,
		pagination,
		filters,
	});

	useEffect(() => {
		if (!selectedBlog && !editBlog && blogs.length > 0) {
			const mostRecentBlog = blogs.reduce((latest, blog) => {
				return !latest || new Date(blog.createdAt) > new Date(latest.createdAt)
					? blog
					: latest;
			}, blogs[0]);
			setSelectedBlog(mostRecentBlog);
		}
	}, [blogs, selectedBlog, editBlog]);

	const { addBlog, updateBlog, deleteBlog, isMutating } = useBlogMutations({
		setSnackbar: showSnackbar,
		resetForm: () => {
			setEditBlog(undefined);
			setSelectedBlog(null);
		},
		pagination,
		blogFilters: filters,
	});

	const initialFormData = useMemo(() => {
		const data = editBlog
			? {
					id: editBlog.id,
					title: editBlog.title,
					slug: editBlog.slug,
					description: editBlog.description || "",
					introductions: editBlog.introductions || "",
					content: editBlog.content,
					blogcategory: editBlog.blogcategory,
					status: editBlog.status,
					tags: editBlog.tags.join(","),
					thumbnail: editBlog.thumbnail || "",
			  }
			: undefined;
		console.log("Initial Form Data:", data); // Log initialFormData
		return data;
	}, [editBlog]);

	const { formData, errors, handleChange, handleSubmit, resetForm } =
		useBlogForm({
			categories,
			initialData: initialFormData,
			onSubmit: async (data) => {
				console.log("Form Submit Data:", data); // Log form data on submit
				try {
					if (data.id && !data.id.startsWith("temp-")) {
						await updateBlog(data);
					} else {
						await addBlog(data);
					}
				} catch (error: any) {
					showSnackbar({
						open: true,
						message:
							error.message ||
							(data.id ? "Failed to update blog" : "Failed to add blog"),
						severity: "error",
					});
				}
			},
		});

	useEffect(() => {
		if (initialError) {
			showSnackbar({
				open: true,
				message: `${initialError}. Displaying sample data.`,
				severity: "error",
			});
		}
	}, [initialError, showSnackbar]);

	useEffect(() => {
		setPagination((prev) => ({
			...prev,
			total: serverPagination.total,
			totalPages: serverPagination.totalPages,
		}));
	}, [serverPagination]);

	const handleEditBlog = (blog: BlogType) => {
		console.log("Edit Blog Data:", blog); // Log blog data when edit is clicked
		console.log("Categories:", categories); // Log categories to verify blogcategory
		if (!blog || !blog.id) {
			showSnackbar({
				open: true,
				message: "Invalid blog data",
				severity: "error",
			});
			return;
		}
		setEditBlog(blog);
		setSelectedBlog(null);
		showSnackbar({
			open: true,
			message: "Blog loaded for editing",
			severity: "success",
		});
	};

	const handleDeleteBlog = async (id: string) => {
		try {
			await deleteBlog(id);
			if (selectedBlog?.id === id) {
				setSelectedBlog(null);
			}
		} catch (error: any) {
			showSnackbar({
				open: true,
				message: error.message || "Failed to delete blog",
				severity: "error",
			});
		}
	};

	const handleSelectBlog = (blog: BlogType) => {
		setSelectedBlog(blog);
		setEditBlog(undefined);
	};

	const handleCancel = () => {
		setEditBlog(undefined);
		setSelectedBlog(null);
		resetForm();
	};

	if (initialError) {
		return (
			<Box sx={{ textAlign: "center", py: 4, color: "white" }}>
				<Typography color="error">{initialError}</Typography>
				<Typography sx={{ mt: 1, color: "rgba(255, 255, 255, 0.7)" }}>
					Showing sample data. Please try again later.
				</Typography>
				<Button
					onClick={() => window.location.reload()}
					variant="contained"
					sx={{ mt: 2, backgroundColor: "#3d2352", color: "white" }}
				>
					Retry
				</Button>
				<BlogLayout
					blogs={blogs}
					categories={categories}
					isLoading={isLoading}
					pagination={pagination}
					setPagination={setPagination}
					handleEditBlog={handleEditBlog}
					handleDeleteBlog={handleDeleteBlog}
					handleSelectBlog={handleSelectBlog}
					handleCancel={handleCancel}
					initialBlogData={editBlog}
					selectedBlog={selectedBlog}
					formData={formData}
					formErrors={errors}
					handleChange={handleChange}
					handleSubmit={handleSubmit}
					filters={filters}
					setFilters={setFilters}
				/>
			</Box>
		);
	}

	if (isLoading && !blogs.length) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<BlogLayout
			blogs={blogs}
			categories={categories}
			isLoading={isLoading || isMutating}
			pagination={pagination}
			setPagination={setPagination}
			handleEditBlog={handleEditBlog}
			handleDeleteBlog={handleDeleteBlog}
			handleSelectBlog={handleSelectBlog}
			handleCancel={handleCancel}
			initialBlogData={editBlog}
			selectedBlog={selectedBlog}
			formData={formData}
			formErrors={errors}
			handleChange={handleChange}
			handleSubmit={handleSubmit}
			filters={filters}
			setFilters={setFilters}
		/>
	);
};

export default BlogPageClient;
