import React, {
	useState,
	useMemo,
	forwardRef,
	useImperativeHandle,
} from "react";
import {
	Card,
	CardContent,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Chip,
	IconButton,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import { FinanceType, FinanceCategoryType } from "@/types/interface";

interface TransactionHistoryProps {
	finances: FinanceType[];
	categories: FinanceCategoryType[];
	loading: boolean;
	handleEdit: (finance: FinanceType) => void;
	handleDelete: (id: string) => Promise<void>;
	onFilteredFinancesChange: (filteredFinances: FinanceType[]) => void;
}

const TransactionHistory = forwardRef<
	{ filteredFinances: FinanceType[] },
	TransactionHistoryProps
>(
	(
		{
			finances,
			categories,
			loading,
			handleEdit,
			handleDelete,
			onFilteredFinancesChange,
		},
		ref
	) => {
		const [filter, setFilter] = useState({
			month: new Date().getMonth() + 1,
			year: new Date().getFullYear(),
			type: "all" as "all" | "income" | "expense",
			category: "all",
			dayOfWeek: "all" as "all" | number,
		});

		// Memoize filteredFinances to prevent unnecessary recalculations
		const filteredFinances = useMemo(() => {
			const result = finances.filter((finance) => {
				const financeDate = new Date(finance.date);
				const matchMonth = financeDate.getMonth() + 1 === filter.month;
				const matchYear = financeDate.getFullYear() === filter.year;
				const matchType = filter.type === "all" || finance.type === filter.type;
				const matchCategory =
					filter.category === "all" || finance.category === filter.category;
				const matchDayOfWeek =
					filter.dayOfWeek === "all" ||
					financeDate.getDay() === filter.dayOfWeek;
				return (
					matchMonth &&
					matchYear &&
					matchType &&
					matchCategory &&
					matchDayOfWeek
				);
			});
			onFilteredFinancesChange(result); // Update parent when filters change
			return result;
		}, [
			finances,
			filter.month,
			filter.year,
			filter.type,
			filter.category,
			filter.dayOfWeek,
			onFilteredFinancesChange,
		]);

		// Expose filteredFinances via ref
		useImperativeHandle(ref, () => ({
			filteredFinances,
		}));

		// Reset filters
		const resetFilters = () => {
			setFilter({
				month: new Date().getMonth() + 1,
				year: new Date().getFullYear(),
				type: "all",
				category: "all",
				dayOfWeek: "all",
			});
		};

		return (
			<Card sx={{ borderRadius: 2, boxShadow: 3, overflowX: "auto", mt: 4 }}>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
						Transaction History
					</Typography>

					{/* Filters */}
					<Grid container spacing={2} sx={{ mb: 3 }}>
						<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
							<FormControl fullWidth>
								<InputLabel>Month</InputLabel>
								<Select
									value={filter.month}
									onChange={(e) =>
										setFilter({ ...filter, month: Number(e.target.value) })
									}
									label="Month"
									disabled={loading}
									aria-label="Select month"
								>
									{Array.from({ length: 12 }, (_, i) => (
										<MenuItem key={i + 1} value={i + 1}>
											{new Date(0, i).toLocaleString("default", {
												month: "long",
											})}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
							<TextField
								fullWidth
								label="Year"
								type="number"
								value={filter.year}
								onChange={(e) =>
									setFilter({ ...filter, year: Number(e.target.value) })
								}
								disabled={loading}
								InputProps={{
									inputProps: { min: 2000, max: new Date().getFullYear() },
								}}
								aria-label="Enter year"
							/>
						</Grid>
						<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
							<FormControl fullWidth>
								<InputLabel>Type</InputLabel>
								<Select
									value={filter.type}
									onChange={(e) =>
										setFilter({
											...filter,
											type: e.target.value as "all" | "income" | "expense",
										})
									}
									label="Type"
									disabled={loading}
									aria-label="Select type"
								>
									<MenuItem value="all">All</MenuItem>
									<MenuItem value="income">Income</MenuItem>
									<MenuItem value="expense">Expense</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
							<FormControl fullWidth>
								<InputLabel>Category</InputLabel>
								<Select
									value={filter.category}
									onChange={(e) =>
										setFilter({ ...filter, category: e.target.value })
									}
									label="Category"
									disabled={loading}
									aria-label="Select category"
								>
									<MenuItem value="all">All</MenuItem>
									{categories.map((cat) => (
										<MenuItem key={cat.id} value={cat.id}>
											{cat.name} ({cat.type})
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
							<FormControl fullWidth>
								<InputLabel>Day of Week</InputLabel>
								<Select
									value={filter.dayOfWeek}
									onChange={(e) =>
										setFilter({
											...filter,
											dayOfWeek: e.target.value as "all" | number,
										})
									}
									label="Day of Week"
									disabled={loading}
									aria-label="Select day of week"
								>
									<MenuItem value="all">All</MenuItem>
									{[
										"Sunday",
										"Monday",
										"Tuesday",
										"Wednesday",
										"Thursday",
										"Friday",
										"Saturday",
									].map((day, index) => (
										<MenuItem key={index} value={index}>
											{day}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 12, sm: 6, md: 12 }}>
							<Button
								variant="outlined"
								onClick={resetFilters}
								disabled={loading}
								sx={{ textTransform: "none", fontWeight: 500 }}
								aria-label="Reset filters"
							>
								Reset Filters
							</Button>
						</Grid>
					</Grid>

					{/* Table */}
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Type</TableCell>
								<TableCell>Amount</TableCell>
								<TableCell>Category</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Date</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredFinances.map((finance) => {
								const category = categories.find(
									(cat) => cat.id === finance.category
								);
								return (
									<TableRow key={finance.id}>
										<TableCell>
											<Chip
												label={finance.type}
												color={finance.type === "income" ? "success" : "error"}
												size="small"
											/>
										</TableCell>
										<TableCell>{finance.amount.toLocaleString()} VND</TableCell>
										<TableCell>
											{category ? category.name : "Unknown"}
										</TableCell>
										<TableCell>{finance.description || "-"}</TableCell>
										<TableCell>
											{new Date(finance.date).toLocaleDateString()}
										</TableCell>
										<TableCell align="right">
											<IconButton
												onClick={() => handleEdit(finance)}
												disabled={loading}
												aria-label={`Edit transaction ${finance.id}`}
											>
												<Edit size={20} />
											</IconButton>
											<IconButton
												onClick={() => handleDelete(finance.id)}
												disabled={loading}
												aria-label={`Delete transaction ${finance.id}`}
											>
												<Trash2 size={20} color="red" />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
							{filteredFinances.length === 0 && (
								<TableRow>
									<TableCell colSpan={6} align="center">
										No transactions found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		);
	}
);

TransactionHistory.displayName = "TransactionHistory";

export default TransactionHistory;
