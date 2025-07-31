"use client";
import React from "react";
import {
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { FinanceCategoryType, FinanceEntryType } from "@/types/interface";
import { useTransactionFormNew } from "@/hooks/useTransactionFormNew";

interface AddTransactionFormNewProps {
	categories: FinanceCategoryType[];
	loading: boolean;
	onSubmit: (data: {
		id: string | null;
		type: FinanceEntryType;
		amount: number;
		category: string;
		description?: string;
		date: string;
	}) => Promise<void>;
}

const AddTransactionFormNew: React.FC<AddTransactionFormNewProps> = ({
	categories,
	loading,
	onSubmit,
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const {
		formData,
		errors,
		filteredCategories,
		handleChange,
		handleCategoryChange,
		handleTypeChange,
		handleSubmit,
		resetForm,
	} = useTransactionFormNew({ categories, onSubmit });

	return (
		<form onSubmit={handleSubmit}>
			<Grid container spacing={1.5}>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<FormControl
						fullWidth
						size={isMobile ? "small" : "medium"}
						error={!!errors.type}
						sx={{
							"& .MuiInputBase-root": {
								fontSize: { xs: "0.875rem", sm: "1rem" },
							},
						}}
					>
						<InputLabel id="type-label">Type</InputLabel>
						<Select
							labelId="type-label"
							name="type"
							value={formData.type}
							onChange={(e) =>
								handleTypeChange(e.target.value as FinanceEntryType)
							}
							label="Type"
							disabled={loading}
							aria-label="Select transaction type"
						>
							<MenuItem value="income">Income</MenuItem>
							<MenuItem value="expense">Expense</MenuItem>
							<MenuItem value="saving">Saving</MenuItem>
							<MenuItem value="investment">Investment</MenuItem>
							<MenuItem value="debt">Debt</MenuItem>
							<MenuItem value="loan">Loan</MenuItem>
							<MenuItem value="other">Other</MenuItem>
						</Select>
						{errors.type && (
							<Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
								{errors.type}
							</Typography>
						)}
					</FormControl>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<TextField
						fullWidth
						label="Amount"
						name="amount"
						value={formData.amount}
						onChange={handleChange}
						type="number"
						error={!!errors.amount}
						helperText={errors.amount}
						disabled={loading}
						size={isMobile ? "small" : "medium"}
						sx={{
							"& .MuiInputBase-root": {
								fontSize: { xs: "0.875rem", sm: "1rem" },
							},
						}}
						aria-label="Enter transaction amount"
						inputProps={{ min: 0 }}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4 }}>
					<FormControl
						fullWidth
						size={isMobile ? "small" : "medium"}
						error={!!errors.category}
						sx={{
							"& .MuiInputBase-root": {
								fontSize: { xs: "0.875rem", sm: "1rem" },
							},
						}}
					>
						<InputLabel id="category-label">Category</InputLabel>
						<Select
							labelId="category-label"
							name="category"
							value={formData.category}
							onChange={(e) => handleCategoryChange(e.target.value)}
							label="Category"
							disabled={loading || !formData.type}
							aria-label="Select transaction category"
						>
							<MenuItem value="" disabled>
								Select a category
							</MenuItem>
							{filteredCategories.map((cat) => (
								<MenuItem key={cat.id} value={cat.id}>
									{cat.name}
								</MenuItem>
							))}
						</Select>
						{errors.category && (
							<Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
								{errors.category}
							</Typography>
						)}
					</FormControl>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 6 }}>
					<TextField
						fullWidth
						label="Description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						error={!!errors.description}
						helperText={errors.description}
						disabled={loading}
						size={isMobile ? "small" : "medium"}
						sx={{
							"& .MuiInputBase-root": {
								fontSize: { xs: "0.875rem", sm: "1rem" },
							},
						}}
						aria-label="Enter transaction description"
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 6 }}>
					<TextField
						fullWidth
						label="Date"
						name="date"
						type="date"
						value={formData.date}
						onChange={handleChange}
						error={!!errors.date}
						helperText={errors.date}
						disabled={loading}
						size={isMobile ? "small" : "medium"}
						sx={{
							"& .MuiInputBase-root": {
								fontSize: { xs: "0.875rem", sm: "1rem" },
							},
						}}
						aria-label="Select transaction date"
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 12, md: 12 }}>
					<Button
						type="submit"
						variant="contained"
						disabled={loading}
						sx={{
							textTransform: "none",
							fontWeight: 500,
							fontSize: { xs: "0.875rem", sm: "1rem" },
							py: isMobile ? 1 : 1.5,
							px: 2,
						}}
						aria-label="Add transaction"
					>
						Add Transaction
					</Button>
					<Button
						variant="outlined"
						onClick={resetForm}
						disabled={loading}
						sx={{
							textTransform: "none",
							fontWeight: 500,
							fontSize: { xs: "0.875rem", sm: "1rem" },
							py: isMobile ? 1 : 1.5,
							px: 2,
							ml: 1,
						}}
						aria-label="Clear form"
					>
						Clear
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

export default AddTransactionFormNew;
