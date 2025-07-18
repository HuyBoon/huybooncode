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
import { Trash2 } from "lucide-react";

interface FinanceCategory {
	id: string;
	name: string;
	type: "Income" | "Expense" | "Other";
	createdAt: string;
	updatedAt: string;
}

const defaultCategories: Omit<
	FinanceCategory,
	"id" | "createdAt" | "updatedAt"
>[] = [
	{ name: "Salary", type: "Income" },
	{ name: "Freelance", type: "Income" },
	{ name: "Investments", type: "Income" },
	{ name: "Gifts", type: "Income" },
	{ name: "Rental Income", type: "Income" },
	{ name: "Side Hustle", type: "Income" },
	{ name: "Food", type: "Expense" },
	{ name: "Rent/Mortgage", type: "Expense" },
	{ name: "Utilities", type: "Expense" },
	{ name: "Transportation", type: "Expense" },
	{ name: "Entertainment", type: "Expense" },
	{ name: "Healthcare", type: "Expense" },
	{ name: "Shopping", type: "Expense" },
	{ name: "Travel", type: "Expense" },
	{ name: "Education", type: "Expense" },
	{ name: "Debt Repayment", type: "Expense" },
	{ name: "Savings", type: "Other" },
	{ name: "Transfers", type: "Other" },
	{ name: "Miscellaneous", type: "Other" },
];

const CategoryManagementPage = () => {
	const [categories, setCategories] = useState<FinanceCategory[]>([]);
	const [newCategory, setNewCategory] = useState("");
	const [newCategoryType, setNewCategoryType] = useState<
		"Income" | "Expense" | "Other"
	>("Expense");
	const [isLoading, setIsLoading] = useState(false);
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
				if (!res.ok) {
					throw new Error(`Failed to fetch categories: ${res.statusText}`);
				}
				const data: FinanceCategory[] = await res.json();
				if (data.length === 0) {
					try {
						const seedRes = await fetch("/api/finance-categories/seed", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ categories: defaultCategories }),
						});
						if (!seedRes.ok) {
							if (seedRes.status === 404) {
								throw new Error(
									"Seeding endpoint not found. Please check server configuration."
								);
							}
							const errorData = await seedRes.json();
							throw new Error(errorData.error || "Failed to seed categories");
						}
						const seededData: FinanceCategory[] = await seedRes.json();
						setCategories(seededData);
						setSnackbar({
							open: true,
							message: "Default categories seeded successfully",
							severity: "success",
						});
					} catch (seedError) {
						setSnackbar({
							open: true,
							message:
								seedError instanceof Error
									? seedError.message
									: "Failed to seed categories",
							severity: "error",
						});
						// Fallback to default categories locally if seeding fails
						setCategories(
							defaultCategories.map((cat, index) => ({
								id: `temp-${index}`,
								name: cat.name,
								type: cat.type,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							}))
						);
					}
				} else {
					setCategories(data);
				}
			} catch (error) {
				setSnackbar({
					open: true,
					message: error instanceof Error ? error.message : "An error occurred",
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
			const category: FinanceCategory = await res.json();
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

	const handleDelete = async (id: string) => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/finance-categories", {
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
								e.target.value as "Income" | "Expense" | "Other"
							)
						}
						label="Type"
					>
						<MenuItem value="Income">Income</MenuItem>
						<MenuItem value="Expense">Expense</MenuItem>
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
							<TableCell>{category.name}</TableCell>
							<TableCell>{category.type}</TableCell>
							<TableCell>
								<IconButton
									onClick={() => handleDelete(category.id)}
									disabled={isLoading}
								>
									<Trash2 size={20} />
								</IconButton>
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
