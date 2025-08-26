"use client";
import React, { useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	IconButton,
	CircularProgress,
	Snackbar,
	Alert,
} from "@mui/material";
import { Edit, Delete, Save, X } from "lucide-react";
import { useBlogCategories } from "@/hooks/blog/useBlogCategories";
import { useBlogCategoryMutations } from "@/hooks/blog/useBlogCategoryMutations";
import { BlogCategoryType } from "@/types/interface";

interface BlogCategoryProps {
	initialCategories: BlogCategoryType[];
	initialError?: string | null;
}

interface BlogCategoryState {
	id?: string;
	name: string;
	isEditing: boolean;
}

const BlogCategory = ({
	initialCategories,
	initialError,
}: BlogCategoryProps) => {
	const { categories, isLoading, error } = useBlogCategories(initialCategories);
	const [categoryState, setCategoryState] = useState<BlogCategoryState>({
		name: "",
		isEditing: false,
	});
	const [editingId, setEditingId] = useState<string | null>(null);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error" | "warning",
	});

	const { addCategory, updateCategory, deleteCategory, isMutating } =
		useBlogCategoryMutations({
			setSnackbar,
			resetForm: () => {
				setCategoryState({ name: "", isEditing: false });
				setEditingId(null);
			},
		});

	const handleAddOrUpdate = async () => {
		if (!categoryState.name.trim()) {
			setSnackbar({
				open: true,
				message: "Category name is required",
				severity: "error",
			});
			return;
		}
		try {
			if (categoryState.isEditing && editingId) {
				await updateCategory({ id: editingId, name: categoryState.name });
			} else {
				await addCategory({ name: categoryState.name });
			}
		} catch (error: any) {
			setSnackbar({
				open: true,
				message: error.message || "Error saving category",
				severity: "error",
			});
		}
	};

	const handleEdit = (category: BlogCategoryType) => {
		setCategoryState({ name: category.name, isEditing: true });
		setEditingId(category.id);
	};

	const handleCancel = () => {
		setCategoryState({ name: "", isEditing: false });
		setEditingId(null);
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// Debug logging
	console.log("Categories:", categories);

	return (
		<Box
			sx={{
				borderRadius: "24px",
				overflow: "hidden",
				p: 3,
				maxWidth: 600,
				mx: "auto",
				color: "white",
				background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)",
				boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
			}}
		>
			<Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
				Manage Blog Categories
			</Typography>

			{initialError && (
				<Typography color="error" sx={{ mb: 2 }}>
					Initial error: {initialError}
				</Typography>
			)}

			{error && (
				<Typography color="error" sx={{ mb: 2 }}>
					Error loading categories:{" "}
					{error instanceof Error ? error.message : "Unknown error"}
				</Typography>
			)}

			<Box sx={{ mb: 3 }}>
				<TextField
					label="Category Name"
					value={categoryState.name}
					onChange={(e) =>
						setCategoryState({ ...categoryState, name: e.target.value })
					}
					fullWidth
					variant="outlined"
					disabled={isMutating || isLoading}
					sx={{
						mb: 2,
						"& .MuiInputBase-input": { color: "white" },
						"& .MuiInputLabel-root": { color: "white" },
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: "rgba(255, 255, 255, 0.3)",
						},
					}}
				/>
				<Box sx={{ display: "flex", gap: 1 }}>
					<Button
						variant="contained"
						onClick={handleAddOrUpdate}
						disabled={isMutating || isLoading || !categoryState.name.trim()}
						startIcon={categoryState.isEditing ? <Save size={16} /> : null}
						sx={{ bgcolor: "primary.main", color: "white" }}
					>
						{categoryState.isEditing ? "Update" : "Add"} Category
					</Button>
					{categoryState.isEditing && (
						<Button
							variant="outlined"
							onClick={handleCancel}
							disabled={isMutating || isLoading}
							startIcon={<X size={16} />}
							sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
						>
							Cancel
						</Button>
					)}
				</Box>
			</Box>

			<Box sx={{ maxHeight: 400, overflow: "auto" }}>
				<Table sx={{ background: "transparent" }}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: "white" }}>Name</TableCell>
							<TableCell sx={{ color: "white" }}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={2} align="center">
									<CircularProgress size={24} />
								</TableCell>
							</TableRow>
						) : !Array.isArray(categories) ? (
							<TableRow>
								<TableCell colSpan={2} align="center">
									<Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
										Error: Invalid category data
									</Typography>
								</TableCell>
							</TableRow>
						) : categories.length === 0 ? (
							<TableRow>
								<TableCell colSpan={2} align="center">
									<Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
										No categories found
									</Typography>
								</TableCell>
							</TableRow>
						) : (
							categories.map((category) => (
								<TableRow key={category.id}>
									<TableCell sx={{ color: "white" }}>{category.name}</TableCell>
									<TableCell>
										<IconButton
											onClick={() => handleEdit(category)}
											disabled={isMutating || isLoading}
											aria-label={`Edit ${category.name}`}
										>
											<Edit size={16} color="white" />
										</IconButton>
										<IconButton
											onClick={() => deleteCategory(category.id)}
											disabled={isMutating || isLoading}
											aria-label={`Delete ${category.name}`}
										>
											<Delete size={16} color="red" />
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Box>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
					variant="filled"
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default BlogCategory;
