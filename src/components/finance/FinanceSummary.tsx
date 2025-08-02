import React from "react";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	TooltipItem,
} from "chart.js";
import { FinanceType, SummaryFilters } from "@/types/interface";
import { useFinanceSummary } from "@/hooks/useFinanceSummary";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FinanceSummaryProps {
	finances: FinanceType[];
	filters: SummaryFilters;
	setFilters: React.Dispatch<React.SetStateAction<SummaryFilters>>;
}

const FinanceSummary: React.FC<FinanceSummaryProps> = ({
	finances,
	filters,
	setFilters,
}) => {
	const { totals, chartData, balance } = useFinanceSummary({
		finances,
		filters,
	});

	return (
		<Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%" }}>
			<CardContent>
				{finances.length === 0 || chartData.datasets[0].data.length === 0 ? (
					<Box sx={{ textAlign: "center", py: 4 }}>
						<Typography color="text.secondary">
							No financial data available for the selected period.
						</Typography>
					</Box>
				) : (
					<>
						<Grid container spacing={2} sx={{ mb: 3 }}>
							<Grid size={{ xs: 12, sm: 6, md: 4 }}>
								<FormControl fullWidth>
									<InputLabel>Time Range</InputLabel>
									<Select
										value={filters.period}
										onChange={(e) =>
											setFilters({
												period: e.target.value as SummaryFilters["period"],
											})
										}
										label="Time Range"
										aria-label="Select time range"
									>
										<MenuItem value="today">Today</MenuItem>
										<MenuItem value="yesterday">Yesterday</MenuItem>
										<MenuItem value="week">Week</MenuItem>
										<MenuItem value="month">Month</MenuItem>
										<MenuItem value="year">Year</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>
						<Box sx={{ maxWidth: 400, mx: "auto", mb: 3, height: 250 }}>
							<Pie
								data={chartData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											position: "bottom",
											labels: {
												boxWidth: 20,
												padding: 15,
												font: { size: 12 },
											},
										},
										tooltip: {
											callbacks: {
												label: (context: TooltipItem<"pie">) =>
													`${context.label}: ${(
														context.raw as number
													).toLocaleString("vi-VN")} VND`,
											},
										},
										title: {
											display: true,
											text: `Finance Summary (${filters.period})`,
											font: { size: 16, weight: "bold" },
											padding: { top: 10, bottom: 20 },
										},
									},
								}}
							/>
						</Box>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 700,
								textAlign: "center",
								color: balance >= 0 ? "success.main" : "error.main",
							}}
						>
							Balance: {balance.toLocaleString("vi-VN")} VND
						</Typography>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default FinanceSummary;
