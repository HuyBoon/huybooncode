import React, { useMemo } from "react";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
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
import { FinanceType } from "@/types/interface";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface FinanceSummaryProps {
	finances: FinanceType[];
	filters: {
		month: number;
		year: number;
		type:
			| "all"
			| "income"
			| "expense"
			| "saving"
			| "investment"
			| "debt"
			| "loan"
			| "other";
		category: string;
		dayOfWeek: number | "all";
		period: "today" | "month" | "year";
	};
	setFilters: React.Dispatch<
		React.SetStateAction<{
			month: number;
			year: number;
			type:
				| "all"
				| "income"
				| "expense"
				| "saving"
				| "investment"
				| "debt"
				| "loan"
				| "other";
			category: string;
			dayOfWeek: number | "all";
			period: "today" | "month" | "year";
		}>
	>;
}

const FinanceSummary: React.FC<FinanceSummaryProps> = ({
	finances,
	filters,
	setFilters,
}) => {
	// Filter finances based on period
	const filteredFinances = useMemo(() => {
		const now = new Date();
		const startDate = new Date();

		if (filters.period === "today") {
			startDate.setHours(0, 0, 0, 0);
		} else if (filters.period === "month") {
			startDate.setFullYear(filters.year, filters.month - 1, 1);
		} else if (filters.period === "year") {
			startDate.setFullYear(filters.year, 0, 1);
		}

		return finances.filter((finance) => {
			const financeDate = new Date(finance.date);
			return (
				financeDate >= startDate &&
				financeDate <=
					(filters.period === "today"
						? new Date()
						: new Date(filters.year, filters.month, 0))
			);
		});
	}, [finances, filters.period, filters.month, filters.year]);

	// Calculate totals for all finance types
	const totals = useMemo(() => {
		const types = [
			"income",
			"expense",
			"saving",
			"investment",
			"debt",
			"loan",
			"other",
		];
		return filteredFinances.reduce(
			(acc, finance) => {
				if (types.includes(finance.type)) {
					acc[finance.type] = (acc[finance.type] || 0) + finance.amount;
				}
				return acc;
			},
			{
				income: 0,
				expense: 0,
				saving: 0,
				investment: 0,
				debt: 0,
				loan: 0,
				other: 0,
			}
		);
	}, [filteredFinances]);

	// Chart data
	const chartData = useMemo(
		() => ({
			labels: [
				"Income",
				"Expense",
				"Saving",
				"Investment",
				"Debt",
				"Loan",
				"Other",
			],
			datasets: [
				{
					label: "Amount (VND)",
					data: [
						totals.income,
						totals.expense,
						totals.saving,
						totals.investment,
						totals.debt,
						totals.loan,
						totals.other,
					],
					backgroundColor: [
						"#4caf50", // Income: Green
						"#f44336", // Expense: Red
						"#2196f3", // Saving: Blue
						"#ff9800", // Investment: Orange
						"#9c27b0", // Debt: Purple
						"#ffeb3b", // Loan: Yellow
						"#607d8b", // Other: Grey
					],
					borderColor: [
						"#388e3c",
						"#d32f2f",
						"#1976d2",
						"#f57c00",
						"#7b1fa2",
						"#fbc02d",
						"#455a64",
					],
					borderWidth: 1,
				},
			],
		}),
		[totals]
	);

	return (
		<Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%" }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Summary
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 4 }}>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Time Range</InputLabel>
							<Select
								value={filters.period}
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										period: e.target.value as "today" | "month" | "year",
									}))
								}
								label="Time Range"
								aria-label="Select time range"
							>
								<MenuItem value="today">Today</MenuItem>
								<MenuItem value="month">Month</MenuItem>
								<MenuItem value="year">Year</MenuItem>
							</Select>
						</FormControl>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Total Income: {totals.income.toLocaleString()} VND
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Total Expense: {totals.expense.toLocaleString()} VND
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Total Saving: {totals.saving.toLocaleString()} VND
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Total Investment: {totals.investment.toLocaleString()} VND
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Total Debt: {totals.debt.toLocaleString()} VND
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Total Loan: {totals.loan.toLocaleString()} VND
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							Total Other: {totals.other.toLocaleString()} VND
						</Typography>
						<Typography
							variant="body1"
							sx={{
								fontWeight: 500,
								color:
									totals.income + totals.saving + totals.investment >=
									totals.expense + totals.debt + totals.loan
										? "success.main"
										: "error.main",
							}}
						>
							Balance:{" "}
							{(
								totals.income +
								totals.saving +
								totals.investment -
								totals.expense -
								totals.debt -
								totals.loan
							).toLocaleString()}{" "}
							VND
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 8 }}>
						<Bar
							data={chartData}
							options={{
								responsive: true,
								plugins: {
									legend: { display: false },
									title: {
										display: true,
										text: `Finance Summary (${filters.period})`,
									},
								},
							}}
						/>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default FinanceSummary;
