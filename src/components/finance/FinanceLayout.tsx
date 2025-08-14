// src/components/finance/FinanceLayout.tsx
import React from "react";
import { Box, Grid, Card, CardContent, Snackbar, Alert } from "@mui/material";
import AddTransactionForm from "./AddTransactionForm";
import FinanceSummary from "./FinanceSummary";
import TransactionHistory from "./TransactionHistory";
import {
	FinanceType,
	FinanceCategoryType,
	PaginationType,
	TransactionFilters,
	SummaryFilters,
	FinanceEntryType,
} from "@/types/interface";
import { useSnackbar } from "@/context/SnackbarContext"; // Cập nhật import

interface FinanceLayoutProps {
	categories: FinanceCategoryType[];
	transactionFinances: FinanceType[];
	summaryFinances: FinanceType[];
	isLoading: boolean;
	pagination: PaginationType;
	transactionFilters: TransactionFilters;
	summaryFilters: SummaryFilters;
	setTransactionFilters: React.Dispatch<
		React.SetStateAction<TransactionFilters>
	>;
	setSummaryFilters: React.Dispatch<React.SetStateAction<SummaryFilters>>;
	setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
	handleSubmit: (data: {
		id: string | null;
		type: FinanceEntryType;
		amount: number;
		category: string;
		description?: string;
		date: string;
	}) => Promise<void>;
	handleEdit: (finance: FinanceType) => void;
	handleDelete: (id: string) => Promise<void>;
	handleCancel: () => void;
	initialFormData?: FinanceType;
}

const FinanceLayout: React.FC<FinanceLayoutProps> = ({
	categories,
	transactionFinances,
	summaryFinances,
	isLoading,
	pagination,
	transactionFilters,
	summaryFilters,
	setTransactionFilters,
	setSummaryFilters,
	setPagination,
	handleSubmit,
	handleEdit,
	handleDelete,
	handleCancel,
	initialFormData,
}) => {
	const { snackbar, closeSnackbar } = useSnackbar();

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", mt: 2, minHeight: "100vh" }}>
			<Grid container spacing={2}>
				<Grid container spacing={2}>
					<Grid
						size={{ xs: 12, md: 6 }}
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
						}}
					>
						<AddTransactionForm
							categories={categories}
							loading={isLoading}
							onSubmit={handleSubmit}
							onCancel={handleCancel}
							initialData={
								initialFormData
									? {
											id: initialFormData.id,
											type: initialFormData.type,
											amount: initialFormData.amount.toString(),
											category: initialFormData.category,
											description: initialFormData.description || "",
											date: new Date(initialFormData.date)
												.toISOString()
												.split("T")[0],
									  }
									: undefined
							}
						/>
					</Grid>
					<Grid
						size={{ xs: 12, md: 6 }}
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
						}}
					>
						<FinanceSummary
							finances={summaryFinances}
							filters={summaryFilters}
							setFilters={setSummaryFilters}
						/>
					</Grid>
				</Grid>
				<Grid
					size={{ xs: 12, md: 12 }}
					sx={{
						borderRadius: "24px",
						overflow: "hidden",
					}}
				>
					<TransactionHistory
						finances={transactionFinances}
						categories={categories}
						loading={isLoading}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						onFilteredFinancesChange={() => {}}
						pagination={pagination}
						setPagination={setPagination}
						setFilters={setTransactionFilters}
						filters={transactionFilters}
					/>
				</Grid>
			</Grid>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={closeSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={closeSnackbar}
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

export default FinanceLayout;
