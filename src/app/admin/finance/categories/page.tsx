"use client";

import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Snackbar,
	Alert,
} from "@mui/material";
import { Trash2, Edit2 } from "lucide-react";
import { FinanceCategoryType } from "@/types/interface";

const CategoryManagementPage = () => {
	const [categories, setCategories] = useState<FinanceCategoryType[]>([]);
	const [newCategory, setNewCategory] = useState("");
	const [newCategoryType, setNewCategoryType] = useState<
		"Income" | "Expense" | "Saving" | "Investment" | "Debt" | "Loan" | "Other"
	>("Expense");

	const [isLoading, setIsLoading] = useState(false);
	const [editingCategory, setEditingCategory] =
		useState<FinanceCategoryType | null>(null);
	const [editCategoryName, setEditCategoryName] = useState("");
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error",
	});

	useEffect(() => {
		const fetchCategories = async () => {
			setIsLoading(true);
			try {
				const res = await fetch("/api/finance-categories");
				if (!res.ok) throw new Error("Failed to fetch categories");

				const data: FinanceCategoryType[] = await res.json();
				setCategories(data);
			} catch (error) {
				setSnackbar({
					open: true,
					message:
						error instanceof Error
							? error.message
							: "Failed to load categories",
					severity: "error",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const handleAdd = async () => {
		if (!newCategory.trim()) return;
		setIsLoading(true);
		try {
			const res = await fetch("/api/finance-categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: newCategory, type: newCategoryType }),
			});
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to create category");
			}
			const category: FinanceCategoryType = await res.json();
			setCategories((prev) => [...prev, category]);
			setNewCategory("");
			setNewCategoryType("Expense");
			setSnackbar({
				open: true,
				message: "Category added successfully",
				severity: "success",
			});
		} catch (error) {
			setSnackbar({
				open: true,
				message:
					error instanceof Error ? error.message : "Failed to create category",
				severity: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditStart = (category: FinanceCategoryType) => {
		setEditingCategory(category);
		setEditCategoryName(category.name);
	};

	const handleEditSave = async () => {
		if (!editingCategory || !editCategoryName.trim()) return;
		setIsLoading(true);
		try {
			const res = await fetch(`/api/finance-categories/${editingCategory.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: editCategoryName }),
			});
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to update category");
			}
			const updatedCategory: FinanceCategoryType = await res.json();
			setCategories((prev) =>
				prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
			);
			setEditingCategory(null);
			setEditCategoryName("");
			setSnackbar({
				open: true,
				message: "Category updated successfully",
				severity: "success",
			});
		} catch (error) {
			setSnackbar({
				open: true,
				message:
					error instanceof Error ? error.message : "Failed to update category",
				severity: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditCancel = () => {
		setEditingCategory(null);
		setEditCategoryName("");
	};

	const handleDelete = async (id: string) => {
		setIsLoading(true);
		try {
			const res = await fetch(`/api/finance-categories/${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to delete category");
			}
			setCategories((prev) => prev.filter((c) => c.id !== id));
			setSnackbar({
				open: true,
				message: "Category deleted successfully",
				severity: "success",
			});
		} catch (error) {
			setSnackbar({
				open: true,
				message:
					error instanceof Error ? error.message : "Failed to delete category",
				severity: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", py: 4 }}>
			<Typography variant="h4" sx={{ mb: 4 }}>
				Manage Categories
			</Typography>
			{isLoading && <Typography>Loading...</Typography>}
			<Box sx={{ display: "flex", gap: 2, mb: 4 }}>
				<TextField
					label="New Category"
					value={newCategory}
					onChange={(e) => setNewCategory(e.target.value)}
					fullWidth
					disabled={isLoading}
				/>
				<FormControl sx={{ minWidth: 120 }} disabled={isLoading}>
					<InputLabel>Type</InputLabel>
					<Select
						value={newCategoryType}
						onChange={(e) =>
							setNewCategoryType(
								e.target.value as
									| "Income"
									| "Expense"
									| "Saving"
									| "Investment"
									| "Debt"
									| "Loan"
									| "Other"
							)
						}
						label="Type"
					>
						<MenuItem value="Income">Income</MenuItem>
						<MenuItem value="Expense">Expense</MenuItem>
						<MenuItem value="Saving">Saving</MenuItem>
						<MenuItem value="Investment">Investment</MenuItem>
						<MenuItem value="Debt">Debt</MenuItem>
						<MenuItem value="Loan">Loan</MenuItem>
						<MenuItem value="Other">Other</MenuItem>
					</Select>
				</FormControl>
				<Button
					variant="contained"
					onClick={handleAdd}
					disabled={!newCategory.trim() || isLoading}
				>
					Add
				</Button>
			</Box>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Type</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{categories.map((category) => (
						<TableRow key={category.id}>
							<TableCell>
								{editingCategory?.id === category.id ? (
									<TextField
										value={editCategoryName}
										onChange={(e) => setEditCategoryName(e.target.value)}
										size="small"
										disabled={isLoading}
									/>
								) : (
									category.name
								)}
							</TableCell>
							<TableCell>{category.type}</TableCell>
							<TableCell>
								{editingCategory?.id === category.id ? (
									<>
										<Button
											onClick={handleEditSave}
											disabled={!editCategoryName.trim() || isLoading}
											size="small"
											sx={{ mr: 1 }}
										>
											Save
										</Button>
										<Button
											onClick={handleEditCancel}
											disabled={isLoading}
											size="small"
										>
											Cancel
										</Button>
									</>
								) : (
									<>
										<IconButton
											onClick={() => handleEditStart(category)}
											disabled={isLoading}
										>
											<Edit2 size={20} />
										</IconButton>
										<IconButton
											onClick={() => handleDelete(category.id)}
											disabled={isLoading}
										>
											<Trash2 size={20} />
										</IconButton>
									</>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
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
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default CategoryManagementPage;
