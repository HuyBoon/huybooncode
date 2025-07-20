import React, { useState, useMemo } from "react";
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
}

const FinanceSummary: React.FC<FinanceSummaryProps> = ({ finances }) => {
	const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
		"month"
	);

	// Filter finances based on time range
	const filteredFinances = useMemo(() => {
		const now = new Date();
		const startDate = new Date();

		if (timeRange === "week") {
			startDate.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
		} else if (timeRange === "month") {
			startDate.setDate(1); // Start of current month
		} else if (timeRange === "year") {
			startDate.setMonth(0, 1); // Start of current year
		}

		return finances.filter((finance) => {
			const financeDate = new Date(finance.date);
			return financeDate >= startDate && financeDate <= now;
		});
	}, [finances, timeRange]);

	// Calculate totals
	const totals = useMemo(() => {
		return filteredFinances.reduce(
			(acc, finance) => {
				if (finance.type === "income") {
					acc.income += finance.amount;
				} else if (finance.type === "expense") {
					acc.expense += finance.amount;
				}
				return acc;
			},
			{ income: 0, expense: 0 }
		);
	}, [filteredFinances]);

	// Chart data
	const chartData = useMemo(
		() => ({
			labels: ["Income", "Expense"],
			datasets: [
				{
					label: "Amount (VND)",
					data: [totals.income, totals.expense],
					backgroundColor: ["#4caf50", "#f44336"],
					borderColor: ["#388e3c", "#d32f2f"],
					borderWidth: 1,
				},
			],
		}),
		[totals]
	);

	return (
		<Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Summary
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 4 }}>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Time Range</InputLabel>
							<Select
								value={timeRange}
								onChange={(e) =>
									setTimeRange(e.target.value as "week" | "month" | "year")
								}
								label="Time Range"
								aria-label="Select time range"
							>
								<MenuItem value="week">Week</MenuItem>
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
						<Typography
							variant="body1"
							sx={{
								fontWeight: 500,
								color:
									totals.income >= totals.expense
										? "success.main"
										: "error.main",
							}}
						>
							Balance: {(totals.income - totals.expense).toLocaleString()} VND
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, md: 4 }}>
						<Bar
							data={chartData}
							options={{
								responsive: true,
								plugins: {
									legend: { display: false },
									title: {
										display: true,
										text: `Income vs Expense (${timeRange})`,
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
