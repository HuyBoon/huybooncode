import { Box, Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { motion } from "framer-motion";

interface ChartData {
	months: string[];
	income: number[];
	expense: number[];
	plans: number[];
}

interface FinanceChartProps {
	chartData: ChartData;
}

export default function FinanceChart({ chartData }: FinanceChartProps) {
	return (
		<Box
			component={motion.div}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Card sx={{ boxShadow: 3, bgcolor: "background.paper", mt: 4 }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
						Finance Overview (Last 6 Months)
					</Typography>
					{chartData.months.length === 0 ? (
						<Typography color="text.secondary" align="center">
							No financial data available
						</Typography>
					) : (
						<BarChart
							xAxis={[{ scaleType: "band", data: chartData.months }]}
							series={[
								{ data: chartData.income, label: "Income", color: "#4caf50" },
								{ data: chartData.expense, label: "Expense", color: "#ef5350" },
								{ data: chartData.plans, label: "Budget", color: "#0288d1" },
							]}
							height={300}
						/>
					)}
				</CardContent>
			</Card>
		</Box>
	);
}
