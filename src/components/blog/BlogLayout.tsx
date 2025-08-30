import React from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import AddBlogForm from "@/components/blog/AddBlogForm";
import BlogHistory from "@/components/blog/BlogHistory";
import BlogDetail from "@/components/blog/BlogDetail";
import {
	BlogType,
	BlogCategoryType,
	PaginationType,
	BlogFilters,
} from "@/types/interface";

interface FormData {
	id?: string;
	title: string;
	slug: string;
	description: string;
	introductions: string;
	content: string;
	blogcategory: string;
	status: string;
	tags: string;
	thumbnail: string;
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

interface BlogLayoutProps {
	blogs: BlogType[];
	categories: BlogCategoryType[];
	isLoading: boolean;
	pagination: PaginationType;
	setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
	handleEditBlog: (blog: BlogType) => void;
	handleDeleteBlog: (id: string) => void;
	handleSelectBlog: (blog: BlogType) => void;
	handleCancel: () => void;
	initialBlogData?: BlogType;
	selectedBlog: BlogType | null;
	formData: FormData;
	formErrors: FormErrors;
	handleChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| SelectChangeEvent<string>
			| { target: { name: string; value: any } }
	) => void;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
	filters: BlogFilters;
	setFilters: React.Dispatch<React.SetStateAction<BlogFilters>>;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({
	blogs,
	categories,
	isLoading,
	pagination,
	setPagination,
	handleEditBlog,
	handleDeleteBlog,
	handleSelectBlog,
	handleCancel,
	initialBlogData,
	selectedBlog,
	formData,
	formErrors,
	handleChange,
	handleSubmit,
	filters,
	setFilters,
}) => {
	return (
		<Box
			sx={{
				maxWidth: "1400px",
				mx: "auto",
				mt: 4,
				mb: 4,
				bgcolor: "transparent",
			}}
		>
			<Grid container spacing={{ xs: 2, sm: 3 }}>
				<Grid size={{ xs: 12, md: 12 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #2e003e, #3d2352, #1b1b2f)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							display: "flex",
							flexDirection: "column",
							minHeight: { xs: "300px", sm: "350px", md: "550px" },
						}}
					>
						<Box
							sx={{
								background: "transparent",
								boxShadow: "none",
								display: "flex",
								flexDirection: "column",
								height: "100%",
								minHeight: { xs: "300px", sm: "350px", md: "550px" },
							}}
						>
							<Typography variant="h6" sx={{ px: 3, pt: 3, color: "white" }}>
								{initialBlogData ? "Edit Blog" : "Add New Blog"}
							</Typography>
							<AddBlogForm
								categories={categories}
								initialData={initialBlogData}
								onSubmit={handleSubmit}
								onCancel={handleCancel}
								formData={formData}
								formErrors={formErrors}
								handleChange={handleChange}
							/>
						</Box>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 12 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							display: "flex",
							flexDirection: "column",
							minHeight: { xs: "300px", sm: "350px", md: "550px" },
						}}
					>
						<Box
							sx={{
								background: "transparent",
								boxShadow: "none",
								display: "flex",
								flexDirection: "column",
								height: "100%",
								minHeight: { xs: "300px", sm: "350px", md: "550px" },
							}}
						>
							<BlogDetail blog={selectedBlog} />
						</Box>
					</Card>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #5e35b1 0%, #4527a0 100%)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							display: "flex",
							flexDirection: "column",
							minHeight: { xs: "300px", sm: "350px", md: "400px" },
						}}
					>
						<Box
							sx={{
								background: "transparent",
								boxShadow: "none",
								display: "flex",
								flexDirection: "column",
								height: "100%",
								minHeight: { xs: "300px", sm: "350px", md: "400px" },
							}}
						>
							<BlogHistory
								blogs={blogs}
								categories={categories}
								initialPagination={pagination}
								handleEdit={handleEditBlog}
								handleDelete={handleDeleteBlog}
								handleSelectBlog={handleSelectBlog}
								loading={isLoading}
								pagination={pagination}
								setPagination={setPagination}
								filters={filters}
								setFilters={setFilters}
							/>
						</Box>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default BlogLayout;
