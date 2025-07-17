"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	TextField,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Chip,
	IconButton,
	Typography,
	Snackbar,
	Alert,
} from "@mui/material";
import { DollarSign, Edit, Trash2 } from "lucide-react";
import { Finance } from "@/types/interface";
import Loader from "@/components/admin/Loader";

export default function FinancePage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [finances, setFinances] = useState<Finance[]>([]);
	const [formData, setFormData] = useState({
		id: null as string | null,
		type: "income" as "income" | "expense",
		amount: "",
		category: "",
		description: "",
		date: new Date().toISOString().split("T")[0],
	});
	const [isEditing, setIsEditing] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error",
	});

	useEffect(() => {
		const fetchFinances = async () => {
			try {
				const response = await fetch("/api/finance");
				if (response.ok) {
					const data = await response.json();
					setFinances(data);
				} else {
					setSnackbar({
						open: true,
						message: "Failed to fetch finances",
						severity: "error",
					});
				}
			} catch (error) {
				setSnackbar({
					open: true,
					message: "Error fetching finances",
					severity: "error",
				});
			}
		};
		if (status === "authenticated") fetchFinances();
	}, [status]);

	const handleSubmit = async () => {
		if (!formData.amount || !formData.category) {
			setSnackbar({
				open: true,
				message: "Amount and category are required",
				severity: "error",
			});
			return;
		}

		const body = {
			id: formData.id,
			type: formData.type,
			amount: parseFloat(formData.amount),
			category: formData.category,
			description: formData.description || undefined,
			date: formData.date,
		};

		try {
			const response = await fetch("/api/finance", {
				method: isEditing ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (response.ok) {
				const updatedFinance = await response.json();
				setFinances((prev) =>
					isEditing
						? prev.map((f) => (f.id === updatedFinance.id ? updatedFinance : f))
						: [...prev, updatedFinance]
				);
				setSnackbar({
					open: true,
					message: isEditing ? "Finance updated!" : "Finance added!",
					severity: "success",
				});
				resetForm();
			} else {
				setSnackbar({
					open: true,
					message: "Failed to save finance",
					severity: "error",
				});
			}
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Error saving finance",
				severity: "error",
			});
		}
	};

	const handleEdit = (finance: Finance) => {
		setFormData({
			id: finance.id,
			type: finance.type,
			amount: finance.amount.toString(),
			category: finance.category,
			description: finance.description || "",
			date: new Date(finance.date).toISOString().split("T")[0],
		});
		setIsEditing(true);
	};

	const handleDelete = async (id: string) => {
		try {
			const response = await fetch("/api/finance", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (response.ok) {
				setFinances((prev) => prev.filter((f) => f.id !== id));
				setSnackbar({
					open: true,
					message: "Finance deleted!",
					severity: "success",
				});
			} else {
				setSnackbar({
					open: true,
					message: "Failed to delete finance",
					severity: "error",
				});
			}
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Error deleting finance",
				severity: "error",
			});
		}
	};

	const resetForm = () => {
		setFormData({
			id: null,
			type: "income",
			amount: "",
			category: "",
			description: "",
			date: new Date().toISOString().split("T")[0],
		});
		setIsEditing(false);
	};

	if (status === "loading") {
		return <Loader />;
	}

	if (status === "unauthenticated") {
		router.push("/login");
		return null;
	}

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", py: 4 }}>
			<Typography
				variant="h4"
				sx={{ fontWeight: "bold", color: "text.primary", mb: 4 }}
			>
				Manage Finances
			</Typography>

			{/* Form */}
			<Card sx={{ boxShadow: 3, bgcolor: "background.paper", mb: 4 }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
						{isEditing ? "Edit Financial Record" : "Add Financial Record"}
					</Typography>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								select
								label="Type"
								value={formData.type}
								onChange={(e) =>
									setFormData({
										...formData,
										type: e.target.value as "income" | "expense",
									})
								}
								fullWidth
							>
								<MenuItem value="income">Income</MenuItem>
								<MenuItem value="expense">Expense</MenuItem>
								<MenuItem value="plan">Plan</MenuItem>
							</TextField>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								label="Amount"
								type="number"
								value={formData.amount}
								onChange={(e) =>
									setFormData({ ...formData, amount: e.target.value })
								}
								fullWidth
							/>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								label="Category"
								value={formData.category}
								onChange={(e) =>
									setFormData({ ...formData, category: e.target.value })
								}
								fullWidth
							/>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								label="Date"
								type="date"
								value={formData.date}
								onChange={(e) =>
									setFormData({ ...formData, date: e.target.value })
								}
								fullWidth
							/>
						</Grid>
						<Grid size={{ xs: 12 }}>
							<TextField
								label="Description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								fullWidth
								multiline
								rows={3}
							/>
						</Grid>
						<Grid size={{ xs: 12 }}>
							<Box sx={{ display: "flex", gap: 2, mt: 2 }}>
								<Button
									variant="contained"
									color="primary"
									onClick={handleSubmit}
									startIcon={<DollarSign size={20} />}
								>
									{isEditing ? "Update" : "Add"}
								</Button>
								<Button
									variant="outlined"
									color="secondary"
									onClick={resetForm}
								>
									Cancel
								</Button>
							</Box>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Finance Table */}
			<Card sx={{ boxShadow: 3, bgcolor: "background.paper" }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
						Financial Records
					</Typography>
					<Divider sx={{ mb: 2 }} />
					<Table sx={{ minWidth: { xs: "auto", md: 650 } }}>
						<TableHead>
							<TableRow>
								<TableCell>Type</TableCell>
								<TableCell>Amount</TableCell>
								<TableCell>Category</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{finances.map((finance) => (
								<TableRow key={finance.id}>
									<TableCell>
										<Chip
											label={finance.type}
											color={
												finance.type === "income"
													? "success"
													: finance.type === "expense"
													? "error"
													: "info"
											}
											size="small"
										/>
									</TableCell>
									<TableCell>${finance.amount.toFixed(2)}</TableCell>
									<TableCell>{finance.category}</TableCell>
									<TableCell>{finance.description || "-"}</TableCell>
									<TableCell>
										{new Date(finance.date).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<IconButton onClick={() => handleEdit(finance)}>
											<Edit size={20} />
										</IconButton>
										<IconButton onClick={() => handleDelete(finance.id)}>
											<Trash2 size={20} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}
