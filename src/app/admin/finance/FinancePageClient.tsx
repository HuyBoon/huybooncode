// src/app/finance/FinancePageClient.tsx
"use client";

import React, { useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import {
	FinanceType,
	FinanceCategoryType,
	PaginationType,
	TransactionFilters,
	SummaryFilters,
	FinanceEntryType,
} from "@/types/interface";
import { useFinanceData } from "@/hooks/useFinanceData";
import {
	handleAddOrUpdateFinance,
	handleDeleteFinance,
} from "@/hooks/useFinanceMutations";
import FinanceLayout from "@/components/finance/FinanceLayout";
import { useSnackbar } from "@/context/SnackbarContext"; // Cập nhật import

interface FinancePageClientProps {
	initialFinances: FinanceType[];
	initialCategories: FinanceCategoryType[];
	initialPagination: PaginationType;
}

const FinancePageClient: React.FC<FinancePageClientProps> = ({
	initialFinances,
	initialCategories,
	initialPagination,
}) => {
	const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
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
	const [pagination, setPagination] =
		useState<PaginationType>(initialPagination);
	const [editFinance, setEditFinance] = useState<FinanceType | undefined>(
		undefined
	);

	const {
		categories,
		transactionFinances,
		summaryFinances,
		isLoading,
		addOrUpdateMutation,
		deleteMutation,
		pagination: fetchedPagination,
	} = useFinanceData({
		initialFinances,
		initialCategories,
		initialPagination,
		transactionFilters,
		summaryFilters,
		pagination,
	});

	const handleSubmit = handleAddOrUpdateFinance(
		addOrUpdateMutation,
		showSnackbar,
		() => setEditFinance(undefined) // Đã thêm resetEdit từ trước
	);
	const handleDelete = handleDeleteFinance(deleteMutation, showSnackbar);

	const handleEdit = (finance: FinanceType) => {
		if (!finance || !finance.id) {
			showSnackbar({
				open: true,
				message: "Invalid transaction data",
				severity: "error",
			});
			return;
		}
		setEditFinance(finance);
		showSnackbar({
			open: true,
			message: "Transaction loaded for editing",
			severity: "success",
		});
	};

	const handleCancel = () => {
		setEditFinance(undefined);
	};

	if (isLoading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					backgroundColor: "#f5f5f5",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<FinanceLayout
			categories={categories}
			transactionFinances={transactionFinances}
			summaryFinances={summaryFinances}
			isLoading={
				isLoading || addOrUpdateMutation.isPending || deleteMutation.isPending
			}
			pagination={fetchedPagination}
			transactionFilters={transactionFilters}
			summaryFilters={summaryFilters}
			setTransactionFilters={setTransactionFilters}
			setSummaryFilters={setSummaryFilters}
			setPagination={setPagination}
			handleSubmit={handleSubmit}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
			handleCancel={handleCancel}
			initialFormData={editFinance}
		/>
	);
};

export default FinancePageClient;
