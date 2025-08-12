"use client";

import React, { useState, useRef } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import AddTransactionForm from "@/components/finance/AddTransactionForm";

import FinanceSummary from "@/components/finance/FinanceSummary";
import {
	FinanceType,
	FinanceCategoryType,
	TransactionFilters,
	PaginationType,
	FinanceEntryType,
	SummaryFilters,
} from "@/types/interface";

import { useFinanceData } from "@/hooks/finance/useFinanceData";
import { useSnackbar } from "@/context/SnackbarContext";

import HeroAdmin from "./HeroAdmin";

interface DashboardProps {
	initialFinances: FinanceType[];
	initialCategories: FinanceCategoryType[];
}

const DashboardLayout: React.FC<DashboardProps> = ({
	initialFinances,
	initialCategories,
}) => {
	const { snackbar, showSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [editFinance, setEditFinance] = useState<FinanceType | undefined>(
		undefined
	);
	const [transactionFilters, setTransactionFilters] =
		useState<TransactionFilters>({
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear(),
			type: "all" as FinanceEntryType,
			category: "all",
			dayOfWeek: "all",
			period: "today",
		});
	const [summaryFilters, setSummaryFilters] = useState<SummaryFilters>({
		period: "today",
	});
	const [pagination, setPagination] = useState<PaginationType>({
		page: 1,
		limit: 10,
		total: initialFinances.length,
		totalPages: Math.ceil(initialFinances.length / 10),
	});
	const transactionHistoryRef = useRef<{ filteredFinances: FinanceType[] }>(
		null
	);

	const {
		categories,
		transactionFinances,
		summaryFinances,
		isLoading,
		addOrUpdateMutation,
		deleteMutation,
	} = useFinanceData({
		initialFinances,
		initialCategories,
		initialPagination: {
			page: 1,
			limit: 10,
			total: initialFinances.length,
			totalPages: Math.ceil(initialFinances.length / 10),
		},
		transactionFilters,
		summaryFilters,
		pagination,
	});

	const handleAddOrUpdateFinance = async (data: {
		id: string | null;
		type: FinanceEntryType;
		amount: number;
		category: string;
		description?: string;
		date: string;
	}) => {
		setLoading(true);
		try {
			const newTransaction = await addOrUpdateMutation.mutateAsync(data);
			setEditFinance(undefined); // Reset form after add/update
			showSnackbar({
				open: true,
				message: data.id
					? "Transaction updated successfully!"
					: "Transaction added successfully!",
				severity: "success",
			});
		} catch (error) {
			showSnackbar({
				open: true,
				message: (error as Error).message || "Error saving transaction",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setEditFinance(undefined);
	};

	const handleFilteredFinancesChange = (filteredFinances: FinanceType[]) => {
		setPagination((prev) => ({
			...prev,
			total: filteredFinances.length,
			totalPages: Math.ceil(filteredFinances.length / prev.limit),
		}));
	};

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto" }}>
			<Card sx={{ mb: 2, borderRadius: "24px", overflow: "hidden" }}>
				<HeroAdmin />
			</Card>
			<Grid container spacing={2}>
				<Grid
					size={{ xs: 12, md: 6 }}
					sx={{
						borderRadius: "24px",
						overflow: "hidden",
						background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
					}}
				>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "transparent",
						}}
					>
						<AddTransactionForm
							categories={categories}
							loading={isLoading || addOrUpdateMutation.isPending}
							onSubmit={handleAddOrUpdateFinance}
							onCancel={editFinance ? handleCancel : undefined}
							initialData={
								editFinance
									? {
											id: editFinance.id,
											type: editFinance.type,
											amount: editFinance.amount.toString(),
											category: editFinance.category,
											description: editFinance.description || "",
											date: new Date(editFinance.date)
												.toISOString()
												.split("T")[0],
									  }
									: undefined
							}
						/>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}></Grid>
			</Grid>
		</Box>
	);
};

export default DashboardLayout;
