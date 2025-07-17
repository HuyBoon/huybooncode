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

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch("/api/finance-categories");
				if (!res.ok) {
					throw new Error("Failed to fetch categories");
				}
				const data: FinanceCategory[] = await res.json();
				if (data.length === 0) {
					// Seed default categories if none exist
					const seedRes = await fetch("/api/finance-categories/seed", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ categories: defaultCategories }),
					});
					if (seedRes.ok) {
						const seededData: FinanceCategory[] = await seedRes.json();
						setCategories(seededData);
					}
				} else {
					setCategories(data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchCategories();
	}, []);

	const handleAdd = async () => {
		if (!newCategory.trim()) return;
		try {
			const res = await fetch("/api/finance-categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: newCategory, type: newCategoryType }),
			});
			if (!res.ok) {
				throw new Error("Failed to create category");
			}
			const category: FinanceCategory = await res.json();
			setCategories((prev) => [...prev, category]);
			setNewCategory("");
			setNewCategoryType("Expense");
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const res = await fetch("/api/finance-categories", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) {
				throw new Error("Failed to delete category");
			}
			setCategories((prev) => prev.filter((c) => c.id !== id));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", py: 4 }}>
			<Typography variant="h4" sx={{ mb: 4 }}>
				Manage Categories
			</Typography>
			<Box sx={{ display: "flex", gap: 2, mb: 4 }}>
				<TextField
					label="New Category"
					value={newCategory}
					onChange={(e) => setNewCategory(e.target.value)}
					fullWidth
				/>
				<FormControl sx={{ minWidth: 120 }}>
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
					disabled={!newCategory.trim()}
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
								<IconButton onClick={() => handleDelete(category.id)}>
									<Trash2 size={20} />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Box>
	);
};

export default CategoryManagementPage;
