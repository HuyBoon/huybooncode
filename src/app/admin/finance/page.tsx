"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	TextField,
	MenuItem,
	Typography,
	Snackbar,
	Alert,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	Stack,
} from "@mui/material";
import { Bitcoin } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { FinanceType, FinanceCategoryType } from "@/types/interface";
import Loader from "@/components/admin/Loader";
import TransactionHistory from "@/components/admin/TransactionHistory";
import FinanceSummary from "@/components/admin/FinanceSummary";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const FinancePage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [finances, setFinances] = useState<FinanceType[]>([]);
	const [categories, setCategories] = useState<FinanceCategoryType[]>([]);
	const [formData, setFormData] = useState({
		id: null as string | null,
		type: "income" as "income" | "expense",
		amount: "",
		category: "",
		description: "",
		date: new Date().toISOString().split("T")[0],
	});
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error",
	});
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 1,
	});
	const [filters, setFilters] = useState({
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
		type: "all" as "all" | "income" | "expense",
		category: "all",
		dayOfWeek: "all" as "all" | number,
	});
	const transactionHistoryRef = useRef<{ filteredFinances: FinanceType[] }>({
		filteredFinances: [],
	});

	// Fetch categories and finances
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/finance-categories");
				if (response.ok) {
					const data = await response.json();
					setCategories(data);
				} else {
					setSnackbar({
						open: true,
						message: "Failed to fetch categories",
						severity: "error",
					});
				}
			} catch (error) {
				setSnackbar({
					open: true,
					message: "Error fetching categories",
					severity: "error",
				});
			}
		};

		const fetchFinances = async () => {
			try {
				const { page, limit } = pagination;
				const { month, year, type, category, dayOfWeek } = filters;
				const params = new URLSearchParams({
					page: page.toString(),
					limit: limit.toString(),
					month: month.toString(),
					year: year.toString(),
					...(type !== "all" && { type }),
					...(category !== "all" && { category }),
					...(dayOfWeek !== "all" && { dayOfWeek: dayOfWeek.toString() }),
				});
				const response = await fetch(`/api/finance?${params}`);
				if (response.ok) {
					const { data, pagination: newPagination } = await response.json();
					setFinances(data);
					setPagination((prev) => ({ ...prev, ...newPagination }));
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

		if (status === "authenticated") {
			fetchCategories().then(() => fetchFinances());
		}
	}, [status, pagination.page, pagination.limit, filters]);

	// Handle form submission
	const handleSubmit = async () => {
		if (!formData.amount || !formData.category) {
			setSnackbar({
				open: true,
				message: "Amount and category are required",
				severity: "error",
			});
			return;
		}

		const selectedCategory = categories.find(
			(cat) => cat.id === formData.category
		);
		if (
			!selectedCategory ||
			selectedCategory.type !==
				formData.type.charAt(0).toUpperCase() + formData.type.slice(1)
		) {
			setSnackbar({
				open: true,
				message: `Category type must match finance type (${formData.type})`,
				severity: "error",
			});
			return;
		}

		setLoading(true);
		const body = {
			id: formData.id,
			type: formData.type,
			amount: parseFloat(formData.amount),
			category: formData.category,
			description: formData.description || undefined,
			date: formData.date,
		};

		try {
			const url = isEditing ? `/api/finance/${formData.id}` : "/api/finance";
			const response = await fetch(url, {
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
				const errorData = await response.json();
				setSnackbar({
					open: true,
					message: errorData.error || "Failed to save finance",
					severity: "error",
				});
			}
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Error saving finance",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	// Handle edit
	const handleEdit = (finance: FinanceType) => {
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

	// Handle delete
	const handleDelete = async (id: string) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/finance/${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (response.ok) {
				setFinances((prev) => prev.filter((f) => f.id !== id));
				setPagination((prev) => ({
					...prev,
					total: prev.total - 1,
					totalPages: Math.ceil((prev.total - 1) / prev.limit),
				}));
				setSnackbar({
					open: true,
					message: "Finance deleted!",
					severity: "success",
				});
			} else {
				const errorData = await response.json();
				setSnackbar({
					open: true,
					message: errorData.error || "Failed to delete finance",
					severity: "error",
				});
			}
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Error deleting finance",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	// Reset form
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

	// Filter categories based on finance type
	const filteredCategories = useMemo(() => {
		return categories.filter((cat) =>
			formData.type === "income"
				? cat.type === "Income"
				: cat.type === "Expense"
		);
	}, [categories, formData.type]);

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	if (status === "loading") {
		return <Loader />;
	}

	if (status === "unauthenticated") {
		router.push("/login");
		return null;
	}

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", py: 6, px: { xs: 2, sm: 3 } }}>
			<Typography
				variant="h4"
				component="h1"
				sx={{ fontWeight: 700, mb: 4, color: "text.primary" }}
			>
				Manage Finances
			</Typography>
			{/* Form */}
			<Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
						{isEditing ? "Edit Transaction" : "Add Transaction"}
					</Typography>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, sm: 6 }}>
							<FormControl fullWidth>
								<InputLabel>Type</InputLabel>
								<Select
									value={formData.type}
									onChange={(e) => {
										const newType = e.target.value as "income" | "expense";
										setFormData({
											...formData,
											type: newType,
											category: "", // Reset category when type changes
										});
									}}
									label="Type"
									disabled={loading}
									aria-label="Select transaction type"
								>
									<MenuItem value="income">Income</MenuItem>
									<MenuItem value="expense">Expense</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								fullWidth
								label="Amount (VND)"
								type="number"
								value={formData.amount}
								onChange={(e) =>
									setFormData({ ...formData, amount: e.target.value })
								}
								disabled={loading}
								InputProps={{ startAdornment: <Bitcoin size={20} /> }}
								aria-label="Enter amount"
							/>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<FormControl fullWidth>
								<InputLabel>Category</InputLabel>
								<Select
									value={formData.category}
									onChange={(e) =>
										setFormData({ ...formData, category: e.target.value })
									}
									label="Category"
									disabled={loading || filteredCategories.length === 0}
									aria-label="Select category"
								>
									{filteredCategories.length === 0 ? (
										<MenuItem value="" disabled>
											No matching categories
										</MenuItem>
									) : (
										filteredCategories.map((cat) => (
											<MenuItem key={cat.id} value={cat.id}>
												{cat.name} ({cat.type})
											</MenuItem>
										))
									)}
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								fullWidth
								label="Date"
								type="date"
								value={formData.date}
								onChange={(e) =>
									setFormData({ ...formData, date: e.target.value })
								}
								disabled={loading}
								InputLabelProps={{ shrink: true }}
								aria-label="Select date"
							/>
						</Grid>
						<Grid size={{ xs: 12 }}>
							<TextField
								fullWidth
								label="Description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								disabled={loading}
								multiline
								rows={2}
								aria-label="Enter description"
							/>
						</Grid>
						<Grid size={{ xs: 12 }}>
							<Stack direction="row" spacing={2} justifyContent="flex-end">
								{isEditing && (
									<Button
										variant="outlined"
										onClick={resetForm}
										disabled={loading}
										sx={{ textTransform: "none", fontWeight: 500 }}
										aria-label="Cancel editing"
									>
										Cancel
									</Button>
								)}
								<Button
									variant="contained"
									onClick={handleSubmit}
									disabled={loading}
									startIcon={
										loading ? (
											<CircularProgress size={20} color="inherit" />
										) : null
									}
									sx={{ textTransform: "none", fontWeight: 500 }}
									aria-label={
										isEditing ? "Update transaction" : "Add transaction"
									}
								>
									{loading ? "Saving..." : isEditing ? "Update" : "Add"}
								</Button>
							</Stack>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Summary */}
			<FinanceSummary finances={finances} />

			{/* Transaction History */}
			<TransactionHistory
				finances={finances}
				categories={categories}
				loading={loading}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
				onFilteredFinancesChange={() => {}}
				pagination={pagination}
				setPagination={setPagination}
				setFilters={setFilters}
				ref={transactionHistoryRef}
			/>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default FinancePage;
