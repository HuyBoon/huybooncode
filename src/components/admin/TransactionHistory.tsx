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
	Stack,
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
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	setPagination: React.Dispatch<
		React.SetStateAction<{
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		}>
	>;
	setFilters: React.Dispatch<
		React.SetStateAction<{
			month: number;
			year: number;
			type: "all" | "income" | "expense";
			category: string;
			dayOfWeek: "all" | number;
		}>
	>;
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
			pagination,
			setPagination,
			setFilters,
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

		// Expose filteredFinances via ref
		useImperativeHandle(ref, () => ({
			filteredFinances: finances,
		}));

		// Reset filters and update parent
		const resetFilters = () => {
			const defaultFilters = {
				month: new Date().getMonth() + 1,
				year: new Date().getFullYear(),
				type: "all" as "all" | "income" | "expense",
				category: "all",
				dayOfWeek: "all" as "all" | number,
			};
			setFilter(defaultFilters);
			setFilters(defaultFilters);
			setPagination((prev) => ({ ...prev, page: 1 }));
		};

		// Update parent filters when local filters change
		const handleFilterChange = (
			newFilter: Partial<typeof filter>,
			resetPage: boolean = false
		) => {
			setFilter((prev) => ({ ...prev, ...newFilter }));
			setFilters((prev) => ({ ...prev, ...newFilter }));
			if (resetPage) {
				setPagination((prev) => ({ ...prev, page: 1 }));
			}
		};

		// Generate page numbers for pagination
		const generatePageNumbers = () => {
			const { page, totalPages } = pagination;
			const maxPagesToShow = 5;
			const pages: (number | string)[] = [];

			if (totalPages <= maxPagesToShow) {
				for (let i = 1; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				const leftBound = Math.max(2, page - 2);
				const rightBound = Math.min(totalPages - 1, page + 2);
				if (leftBound > 2) {
					pages.push("...");
				}
				for (let i = leftBound; i <= rightBound; i++) {
					pages.push(i);
				}
				if (rightBound < totalPages - 1) {
					pages.push("...");
				}
				if (totalPages > 1) {
					pages.push(totalPages);
				}
			}

			return pages;
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
										handleFilterChange({ month: Number(e.target.value) }, true)
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
									handleFilterChange({ year: Number(e.target.value) }, true)
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
										handleFilterChange(
											{ type: e.target.value as "all" | "income" | "expense" },
											true
										)
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
										handleFilterChange({ category: e.target.value }, true)
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
										handleFilterChange(
											{ dayOfWeek: e.target.value as "all" | number },
											true
										)
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
							{finances.map((finance) => {
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
							{finances.length === 0 && (
								<TableRow>
									<TableCell colSpan={6} align="center">
										No transactions found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					{/* Pagination Controls */}
					<Stack
						direction="row"
						spacing={1}
						justifyContent="center"
						alignItems="center"
						mt={3}
					>
						<Button
							variant="outlined"
							disabled={loading || pagination.page === 1}
							onClick={() =>
								setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
							}
							sx={{
								minWidth: 40,
								height: 40,
								borderRadius: "50%",
								fontWeight: 500,
							}}
							aria-label="Previous page"
						>
							&lt;
						</Button>
						{generatePageNumbers().map((pageNum, index) =>
							typeof pageNum === "string" ? (
								<Typography
									key={index}
									sx={{ display: "flex", alignItems: "center", mx: 1 }}
								>
									...
								</Typography>
							) : (
								<Button
									key={pageNum}
									variant={
										pageNum === pagination.page ? "contained" : "outlined"
									}
									onClick={() =>
										setPagination((prev) => ({ ...prev, page: pageNum }))
									}
									disabled={loading}
									sx={{
										minWidth: 40,
										height: 40,
										borderRadius: "50%",
										fontWeight: pageNum === pagination.page ? 700 : 500,
										bgcolor:
											pageNum === pagination.page
												? "primary.main"
												: "transparent",
										color:
											pageNum === pagination.page ? "white" : "text.primary",
										"&:hover": {
											bgcolor:
												pageNum === pagination.page
													? "primary.dark"
													: "grey.100",
										},
									}}
									aria-label={`Go to page ${pageNum}`}
								>
									{pageNum}
								</Button>
							)
						)}
						<Button
							variant="outlined"
							disabled={loading || pagination.page === pagination.totalPages}
							onClick={() =>
								setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
							}
							sx={{
								minWidth: 40,
								height: 40,
								borderRadius: "50%",
								fontWeight: 500,
							}}
							aria-label="Next page"
						>
							&gt;
						</Button>
					</Stack>
				</CardContent>
			</Card>
		);
	}
);

TransactionHistory.displayName = "TransactionHistory";

export default TransactionHistory;
