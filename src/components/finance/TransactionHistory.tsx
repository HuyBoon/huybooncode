"use client";

import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
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
	Box,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import {
	FinanceType,
	FinanceCategoryType,
	TransactionFilters,
} from "@/types/interface";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";

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
	setFilters: React.Dispatch<React.SetStateAction<TransactionFilters>>;
	filters: TransactionFilters;
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
			filters,
		},
		ref
	) => {
		const theme = useTheme();
		const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
		const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
		const { handleFilterChange, resetFilters } = useTransactionFilters({
			setFilters,
			setPagination,
		});

		useImperativeHandle(ref, () => ({
			filteredFinances: finances,
		}));

		useEffect(() => {
			console.log("finances updated:", finances);
			onFilteredFinancesChange(finances);
		}, [finances, onFilteredFinancesChange]);

		const generatePageNumbers = useMemo(() => {
			const pages: (number | string)[] = [];
			const { page, totalPages } = pagination;
			const maxPagesToShow = isMobile ? 3 : 5; // Show fewer pages on mobile

			// Validate pagination data
			if (
				!Number.isInteger(totalPages) ||
				totalPages < 0 ||
				!Number.isInteger(page) ||
				page < 1
			) {
				console.warn("Invalid pagination data:", { page, totalPages });
				return pages;
			}

			if (totalPages === 0) return pages;

			if (totalPages <= maxPagesToShow) {
				for (let i = 1; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				const halfWindow = Math.floor(maxPagesToShow / 2);
				let startPage = Math.max(2, page - halfWindow);
				let endPage = Math.min(totalPages - 1, page + halfWindow);

				if (page <= halfWindow + 1) {
					endPage = maxPagesToShow - 1;
				} else if (page >= totalPages - halfWindow) {
					startPage = totalPages - maxPagesToShow + 2;
				}

				if (startPage > 2) pages.push("...");
				for (let i = startPage; i <= endPage; i++) pages.push(i);
				if (endPage < totalPages - 1) pages.push("...");
				if (totalPages > 1) pages.push(totalPages);
			}

			console.log("Generated page numbers:", pages);
			return pages;
		}, [pagination.page, pagination.totalPages, isMobile]);

		return (
			<Card sx={{ borderRadius: 2, boxShadow: 3, overflowX: "auto" }}>
				<CardContent sx={{ p: { xs: 2, sm: 3 } }}>
					<Typography
						variant="h6"
						sx={{
							fontWeight: 700,
							mb: 2,
							fontSize: { xs: "1.1rem", sm: "1.25rem" },
						}}
					>
						Transaction History
					</Typography>
					{/* Filters */}
					<Grid container spacing={isMobile ? 1 : 1.5} sx={{ mb: 2 }}>
						<Grid size={{ xs: 6, sm: 4, md: 2 }}>
							<FormControl
								fullWidth
								size={isMobile ? "small" : "medium"}
								sx={{
									"& .MuiInputBase-root": {
										fontSize: { xs: "0.875rem", sm: "1rem" },
									},
								}}
							>
								<InputLabel id="period-label">Period</InputLabel>
								<Select
									labelId="period-label"
									value={filters.period}
									onChange={(e) =>
										handleFilterChange(
											{
												period: e.target.value as TransactionFilters["period"],
											},
											true
										)
									}
									label="Period"
									disabled={loading}
									aria-label="Select period"
								>
									<MenuItem value="today">Today</MenuItem>
									<MenuItem value="yesterday">Yesterday</MenuItem>
									<MenuItem value="week">Week</MenuItem>
									<MenuItem value="month">Month</MenuItem>
									<MenuItem value="year">Year</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 6, sm: 4, md: 2 }}>
							<FormControl
								fullWidth
								size={isMobile ? "small" : "medium"}
								disabled={
									filters.period === "today" || filters.period === "yesterday"
								}
								sx={{
									"& .MuiInputBase-root": {
										fontSize: { xs: "0.875rem", sm: "1rem" },
									},
								}}
							>
								<InputLabel id="month-label">Month</InputLabel>
								<Select
									labelId="month-label"
									value={filters.month}
									onChange={(e) =>
										handleFilterChange({ month: Number(e.target.value) }, true)
									}
									label="Month"
									disabled={
										loading ||
										filters.period === "today" ||
										filters.period === "yesterday"
									}
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
						<Grid size={{ xs: 6, sm: 4, md: 2 }}>
							<TextField
								fullWidth
								label="Year"
								type="number"
								value={filters.year}
								onChange={(e) =>
									handleFilterChange({ year: Number(e.target.value) }, true)
								}
								disabled={
									loading ||
									filters.period === "today" ||
									filters.period === "yesterday"
								}
								InputProps={{
									inputProps: { min: 2000, max: new Date().getFullYear() },
								}}
								size={isMobile ? "small" : "medium"}
								sx={{
									"& .MuiInputBase-root": {
										fontSize: { xs: "0.875rem", sm: "1rem" },
									},
								}}
								aria-label="Enter year"
							/>
						</Grid>
						<Grid size={{ xs: 6, sm: 4, md: 2 }}>
							<FormControl
								fullWidth
								size={isMobile ? "small" : "medium"}
								sx={{
									"& .MuiInputBase-root": {
										fontSize: { xs: "0.875rem", sm: "1rem" },
									},
								}}
							>
								<InputLabel id="type-label">Type</InputLabel>
								<Select
									labelId="type-label"
									value={filters.type}
									onChange={(e) =>
										handleFilterChange(
											{ type: e.target.value as TransactionFilters["type"] },
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
									<MenuItem value="saving">Saving</MenuItem>
									<MenuItem value="investment">Investment</MenuItem>
									<MenuItem value="debt">Debt</MenuItem>
									<MenuItem value="loan">Loan</MenuItem>
									<MenuItem value="other">Other</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 6, sm: 4, md: 2 }}>
							<FormControl
								fullWidth
								size={isMobile ? "small" : "medium"}
								sx={{
									"& .MuiInputBase-root": {
										fontSize: { xs: "0.875rem", sm: "1rem" },
									},
								}}
							>
								<InputLabel id="category-label">Category</InputLabel>
								<Select
									labelId="category-label"
									value={filters.category}
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
						<Grid size={{ xs: 6, sm: 4, md: 2 }}>
							<FormControl
								fullWidth
								size={isMobile ? "small" : "medium"}
								disabled={
									filters.period === "today" || filters.period === "yesterday"
								}
								sx={{
									"& .MuiInputBase-root": {
										fontSize: { xs: "0.875rem", sm: "1rem" },
									},
								}}
							>
								<InputLabel id="day-of-week-label">Day of Week</InputLabel>
								<Select
									labelId="day-of-week-label"
									value={filters.dayOfWeek}
									onChange={(e) =>
										handleFilterChange(
											{ dayOfWeek: e.target.value as "all" | number },
											true
										)
									}
									label="Day of Week"
									disabled={
										loading ||
										filters.period === "today" ||
										filters.period === "yesterday"
									}
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
						<Grid size={{ xs: 12, sm: 4, md: 2 }}>
							<Button
								variant="outlined"
								onClick={resetFilters}
								disabled={loading}
								sx={{
									textTransform: "none",
									fontWeight: 500,
									fontSize: { xs: "0.875rem", sm: "1rem" },
									py: isMobile ? 1 : 1.5,
									px: 2,
								}}
								aria-label="Reset filters"
							>
								Reset Filters
							</Button>
						</Grid>
					</Grid>

					{/* Responsive Transaction Display */}
					{isMobile ? (
						<Box>
							{finances.length === 0 ? (
								<Typography
									sx={{
										textAlign: "center",
										py: 2,
										fontSize: { xs: "0.875rem", sm: "1rem" },
									}}
								>
									No transactions found
								</Typography>
							) : (
								finances.map((finance) => {
									const category = categories.find(
										(cat) => cat.id === finance.category
									);
									return (
										<Card
											key={finance.id}
											sx={{
												mb: 1.5,
												borderRadius: 2,
												boxShadow: 1,
												"&:hover": { boxShadow: 3 },
											}}
										>
											<CardContent sx={{ p: 2 }}>
												<Stack
													direction="row"
													justifyContent="space-between"
													alignItems="center"
												>
													<Chip
														label={finance.type}
														color={
															finance.type === "income" ||
															finance.type === "saving" ||
															finance.type === "investment"
																? "success"
																: finance.type === "expense" ||
																  finance.type === "debt" ||
																  finance.type === "loan"
																? "error"
																: "default"
														}
														size="small"
													/>
													<Stack direction="row" spacing={1}>
														<IconButton
															onClick={() => {
																console.log(
																	"Finance khi click Edit (mobile):",
																	finance
																);
																handleEdit(finance);
															}}
															disabled={loading}
															aria-label={`Edit transaction ${finance.id}`}
															size="small"
														>
															<Edit size={16} />
														</IconButton>
														<IconButton
															onClick={() => handleDelete(finance.id)}
															disabled={loading}
															aria-label={`Delete transaction ${finance.id}`}
															size="small"
														>
															<Trash2 size={16} color="red" />
														</IconButton>
													</Stack>
												</Stack>
												<Typography
													variant="body2"
													sx={{
														mt: 1,
														fontSize: { xs: "0.75rem", sm: "0.875rem" },
													}}
												>
													<strong>Amount:</strong>{" "}
													{finance.amount.toLocaleString("vi-VN")} VND
												</Typography>
												<Typography
													variant="body2"
													sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
												>
													<strong>Category:</strong>{" "}
													{category ? category.name : "Unknown"}
												</Typography>
												<Typography
													variant="body2"
													sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
												>
													<strong>Description:</strong>{" "}
													{finance.description || "-"}
												</Typography>
												<Typography
													variant="body2"
													sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
												>
													<strong>Date:</strong>{" "}
													{new Date(finance.date).toLocaleDateString("vi-VN")}
												</Typography>
											</CardContent>
										</Card>
									);
								})
							)}
						</Box>
					) : (
						<Table size={isTablet ? "small" : "medium"}>
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
													color={
														finance.type === "income" ||
														finance.type === "saving" ||
														finance.type === "investment"
															? "success"
															: finance.type === "expense" ||
															  finance.type === "debt" ||
															  finance.type === "loan"
															? "error"
															: "default"
													}
													size="small"
												/>
											</TableCell>
											<TableCell>
												{finance.amount.toLocaleString("vi-VN")} VND
											</TableCell>
											<TableCell>
												{category ? category.name : "Unknown"}
											</TableCell>
											<TableCell>{finance.description || "-"}</TableCell>
											<TableCell>
												{new Date(finance.date).toLocaleDateString("vi-VN")}
											</TableCell>
											<TableCell align="right">
												<IconButton
													onClick={() => {
														console.log(
															"Finance khi click Edit (desktop):",
															finance
														);
														handleEdit(finance);
													}}
													disabled={loading}
													aria-label={`Edit transaction ${finance.id}`}
													size="small"
												>
													<Edit size={16} />
												</IconButton>
												<IconButton
													onClick={() => handleDelete(finance.id)}
													disabled={loading}
													aria-label={`Delete transaction ${finance.id}`}
													size="small"
												>
													<Trash2 size={16} color="red" />
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
					)}

					{/* Pagination Controls */}
					{pagination.total > 0 && (
						<Stack
							direction="row"
							spacing={isMobile ? 0.5 : 1}
							justifyContent="center"
							alignItems="center"
							mt={2}
							sx={{
								overflowX: "auto",
								whiteSpace: "nowrap",
								pb: 1, // Add padding to prevent clipping on scroll
							}}
						>
							<Button
								variant="outlined"
								disabled={loading || pagination.page === 1}
								onClick={() =>
									setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
								}
								sx={{
									minWidth: { xs: 32, sm: 40 },
									height: { xs: 32, sm: 40 },
									borderRadius: "50%",
									fontWeight: 500,
									fontSize: { xs: "0.7rem", sm: "0.875rem" },
									p: isMobile ? 0.5 : 1,
								}}
								aria-label="Previous page"
							>
								{"<"}
							</Button>
							{generatePageNumbers.map((pageNum, index) =>
								typeof pageNum === "string" ? (
									<Typography
										key={`ellipsis-${index}`}
										sx={{
											display: "flex",
											alignItems: "center",
											mx: isMobile ? 0.5 : 1,
											fontSize: { xs: "0.7rem", sm: "0.875rem" },
										}}
									>
										...
									</Typography>
								) : (
									<Button
										key={`page-${pageNum}`}
										variant={
											pageNum === pagination.page ? "contained" : "outlined"
										}
										onClick={() =>
											setPagination((prev) => ({ ...prev, page: pageNum }))
										}
										disabled={loading}
										sx={{
											minWidth: { xs: 32, sm: 40 },
											height: { xs: 32, sm: 40 },
											borderRadius: "50%",
											fontWeight: pageNum === pagination.page ? 700 : 500,
											fontSize: { xs: "0.7rem", sm: "0.875rem" },
											p: isMobile ? 0.5 : 1,
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
									minWidth: { xs: 32, sm: 40 },
									height: { xs: 32, sm: 40 },
									borderRadius: "50%",
									fontWeight: 500,
									fontSize: { xs: "0.7rem", sm: "0.875rem" },
									p: isMobile ? 0.5 : 1,
								}}
								aria-label="Next page"
							>
								{">"}
							</Button>
							<Typography
								sx={{
									ml: isMobile ? 1 : 2,
									fontWeight: 500,
									fontSize: { xs: "0.7rem", sm: "0.875rem" },
								}}
							>
								Page {pagination.page} of {pagination.totalPages}
							</Typography>
						</Stack>
					)}
					{pagination.total === 0 && (
						<Typography
							sx={{
								mt: 2,
								textAlign: "center",
								fontSize: { xs: "0.875rem", sm: "1rem" },
							}}
						>
							No pages to display
						</Typography>
					)}
				</CardContent>
			</Card>
		);
	}
);

export default TransactionHistory;
