"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Typography, Snackbar, Alert, Grid } from "@mui/material";
import { FinanceType, FinanceCategoryType } from "@/types/interface";
import Loader from "@/components/admin/Loader";
import TransactionHistory from "@/components/admin/TransactionHistory";
import FinanceSummary from "@/components/admin/FinanceSummary";
import AddTransactionForm from "@/components/finance/AddTransactionForm";

const FinancePage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [finances, setFinances] = useState<FinanceType[]>([]);
	const [categories, setCategories] = useState<FinanceCategoryType[]>([]);
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
		type: "all" as
			| "all"
			| "income"
			| "expense"
			| "saving"
			| "investment"
			| "debt"
			| "loan"
			| "other",
		category: "all",
		dayOfWeek: "all" as "all" | number,
		period: "today" as "today" | "month" | "year",
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
				const { month, year, type, category, dayOfWeek, period } = filters;
				const params = new URLSearchParams({
					page: page.toString(),
					limit: limit.toString(),
					...(period === "today" && { today: "true" }),
					...(period !== "today" && { month: month.toString() }),
					...(period !== "today" && { year: year.toString() }),
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
	const handleSubmit = async (data: {
		id: string | null;
		type:
			| "income"
			| "expense"
			| "saving"
			| "investment"
			| "debt"
			| "loan"
			| "other";
		amount: number;
		category: string;
		description?: string;
		date: string;
	}) => {
		setLoading(true);
		try {
			const url = data.id ? `/api/finance/${data.id}` : "/api/finance";
			const response = await fetch(url, {
				method: data.id ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (response.ok) {
				const updatedFinance = await response.json();
				setFinances((prev) =>
					data.id
						? prev.map((f) => (f.id === updatedFinance.id ? updatedFinance : f))
						: [...prev, updatedFinance]
				);
				setSnackbar({
					open: true,
					message: data.id ? "Finance updated!" : "Finance added!",
					severity: "success",
				});
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
		return {
			id: finance.id,
			type: finance.type,
			amount: finance.amount.toString(),
			category: finance.category,
			description: finance.description || "",
			date: new Date(finance.date).toISOString().split("T")[0],
		};
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
		<Box sx={{ maxWidth: "lg", mx: "auto", py: 6, px: { xs: 1, sm: 2 } }}>
			<Typography
				variant="h4"
				component="h1"
				sx={{ fontWeight: 700, mb: 4, color: "text.primary" }}
			>
				Manage Finances
			</Typography>
			<Grid container spacing={2} sx={{ mb: 4 }}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<AddTransactionForm
						categories={categories}
						loading={loading}
						onSubmit={handleSubmit}
						onCancel={() => {
							// Reset logic (optional, can be customized)
						}}
						initialData={{
							id: null,
							type: "expense",
							amount: "",
							category: "",
							description: "",
							date: new Date().toISOString().split("T")[0],
						}}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<FinanceSummary
						finances={finances}
						filters={filters}
						setFilters={setFilters}
					/>
				</Grid>
			</Grid>

			{/* Transaction History */}
			<TransactionHistory
				finances={finances}
				categories={categories}
				loading={loading}
				handleEdit={(finance) => {
					const initialData = handleEdit(finance);
					// Logic to pass initialData to AddTransactionForm can be added here
				}}
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
