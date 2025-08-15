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
import { useFinanceSummary } from "@/hooks/finance/useFinanceSummary";
import { useMediaQuery, useTheme } from "@mui/material";

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
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const { totals, chartData, balance } = useFinanceSummary({
		finances,
		filters,
	});

	return (
		<Card
			sx={{
				borderRadius: "24px",
				overflow: "hidden",
				background: "transparent",
				boxShadow: "none",
				display: "flex",
				flexDirection: "column",
				height: "100%",
				minHeight: { xs: "300px", sm: "350px", md: "400px" },
			}}
		>
			<CardContent
				sx={{
					p: { xs: 2, sm: 3 },
					flexGrow: 1, // Allow content to grow
					display: "flex",
					flexDirection: "column",
				}}
			>
				{finances.length === 0 || chartData.datasets[0].data.length === 0 ? (
					<Box
						sx={{
							textAlign: "center",
							py: 4,
							flexGrow: 1,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Typography
							sx={{
								color: "#fff",
								fontSize: { xs: "0.9rem", sm: "1rem" },
							}}
						>
							No financial data available for the selected period.
						</Typography>
					</Box>
				) : (
					<>
						<Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2 }}>
							<Grid size={{ xs: 12, sm: 6, md: 4 }}>
								<FormControl
									fullWidth
									size={isMobile ? "small" : "medium"}
									sx={{ "& .MuiInputBase-root": { fontSize: "1rem" } }}
								>
									<InputLabel sx={{ color: "#fff" }}>Time Range</InputLabel>
									<Select
										value={filters.period}
										onChange={(e) =>
											setFilters({
												period: e.target.value as SummaryFilters["period"],
											})
										}
										label="Time Range"
										sx={{
											color: "#fff",
											"& .MuiOutlinedInput-notchedOutline": {
												borderColor: "#fff",
											},
											"&:hover .MuiOutlinedInput-notchedOutline": {
												borderColor: "#fff",
											},
											"& .MuiSvgIcon-root": { color: "#fff" },
										}}
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
						<Box
							sx={{
								flexGrow: 1,
								maxWidth: { xs: 250, sm: 300, md: 400 },
								mx: "auto",
								mb: 2,
								height: { xs: "50%", sm: "60%", md: "60%" }, // Responsive chart height
							}}
						>
							<Pie
								data={chartData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											position: "bottom",
											labels: {
												boxWidth: isMobile ? 15 : 20,
												padding: isMobile ? 10 : 15,
												font: { size: isMobile ? 10 : 12 },
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
											font: { size: isMobile ? 14 : 16, weight: "bold" },
											padding: { top: 10, bottom: isMobile ? 10 : 20 },
											color: "#fff",
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
								fontSize: { xs: "1rem", sm: "1.25rem" },
								mt: "auto", // Push to bottom
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
