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
} from "@mui/material";
import { Trash2 } from "lucide-react";

interface FinanceCategory {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

const CategoryManagementPage = () => {
	const [categories, setCategories] = useState<FinanceCategory[]>([]);
	const [newCategory, setNewCategory] = useState("");

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch("/api/finance-categories");
				if (!res.ok) {
					throw new Error("Failed to fetch categories");
				}
				const data: FinanceCategory[] = await res.json();
				setCategories(data);
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
				body: JSON.stringify({ name: newCategory }),
			});
			if (!res.ok) {
				throw new Error("Failed to create category");
			}
			const category: FinanceCategory = await res.json();
			setCategories((prev) => [...prev, category]);
			setNewCategory("");
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
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{categories.map((category) => (
						<TableRow key={category.id}>
							<TableCell>{category.name}</TableCell>
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
