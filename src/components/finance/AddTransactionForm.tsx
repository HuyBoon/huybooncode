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
	TextField,
	Button,
	Stack,
	Autocomplete,
	CircularProgress,
} from "@mui/material";
import { Bitcoin } from "lucide-react";
import { FinanceType, FinanceCategoryType } from "@/types/interface";

interface AddTransactionFormProps {
	categories: FinanceCategoryType[];
	loading: boolean;
	onSubmit: (data: {
		id: string | null;
		type:
			| "income"
			| "expense"
			| "saving"
			| "investment"
			| "debt"
			| "loan"
			| "other";
		amount: number;
		category: string;
		description?: string;
		date: string;
	}) => Promise<void>;
	onCancel?: () => void;
	initialData?: {
		id: string | null;
		type:
			| "income"
			| "expense"
			| "saving"
			| "investment"
			| "debt"
			| "loan"
			| "other";
		amount: string;
		category: string;
		description: string;
		date: string;
	};
}

const financeTypes = [
	{ value: "income", label: "Income" },
	{ value: "expense", label: "Expense" },
	{ value: "saving", label: "Saving" },
	{ value: "investment", label: "Investment" },
	{ value: "debt", label: "Debt" },
	{ value: "loan", label: "Loan" },
	{ value: "other", label: "Other" },
] as const;

type FinanceEntryType = (typeof financeTypes)[number]["value"];

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
	categories,
	loading,
	onSubmit,
	onCancel,
	initialData,
}) => {
	const [formData, setFormData] = useState({
		id: initialData?.id || null,
		type: initialData?.type || "expense",
		amount: initialData?.amount || "",
		category: initialData?.category || "",
		description: initialData?.description || "",
		date: initialData?.date || new Date().toISOString().split("T")[0],
	});

	// Load amount history from localStorage
	const [amountHistory, setAmountHistory] = useState<number[]>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("financeAmountHistory");
			return saved ? JSON.parse(saved) : [30000, 100000];
		}
		return [30000, 100000];
	});

	// Save amount to localStorage
	const saveAmountToHistory = (amount: number) => {
		const updatedHistory = Array.from(
			new Set([amount, ...amountHistory])
		).slice(0, 10);
		setAmountHistory(updatedHistory);
		if (typeof window !== "undefined") {
			localStorage.setItem(
				"financeAmountHistory",
				JSON.stringify(updatedHistory)
			);
		}
	};

	// Filter categories based on finance type
	const filteredCategories = useMemo(() => {
		return categories.filter((cat) => cat.type.toLowerCase() === formData.type);
	}, [categories, formData.type]);

	// Handle form submission
	const handleSubmit = async () => {
		if (!formData.amount || !formData.category) {
			return;
		}

		const amount = parseFloat(formData.amount);
		if (isNaN(amount) || amount <= 0) {
			return;
		}

		const selectedCategory = categories.find(
			(cat) => cat.id === formData.category
		);
		if (
			!selectedCategory ||
			selectedCategory.type.toLowerCase() !== formData.type
		) {
			return;
		}

		await onSubmit({
			id: formData.id,
			type: formData.type as FinanceEntryType,
			amount,
			category: formData.category,
			description: formData.description || undefined,
			date: formData.date,
		});

		saveAmountToHistory(amount);
	};

	return (
		<Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%" }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					{formData.id ? "Edit Transaction" : "Add Transaction"}
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, sm: 6 }}>
						<FormControl fullWidth>
							<InputLabel>Type</InputLabel>
							<Select
								value={formData.type}
								onChange={(e) => {
									const newType = e.target.value as FinanceEntryType;
									setFormData({
										...formData,
										type: newType,
										category: "",
									});
								}}
								label="Type"
								disabled={loading}
								aria-label="Select transaction type"
							>
								{financeTypes.map(({ value, label }) => (
									<MenuItem key={value} value={value}>
										{label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Autocomplete
							freeSolo
							options={amountHistory.map((amount) =>
								amount.toLocaleString("vi-VN")
							)}
							value={formData.amount}
							onChange={(e, newValue) =>
								setFormData({
									...formData,
									amount: newValue ? newValue.replace(/[^0-9]/g, "") : "",
								})
							}
							onInputChange={(e, newInputValue) =>
								setFormData({
									...formData,
									amount: newInputValue.replace(/[^0-9]/g, ""),
								})
							}
							renderInput={(params) => (
								<TextField
									{...params}
									fullWidth
									label="Amount (VND)"
									type="text"
									disabled={loading}
									InputProps={{
										...params.InputProps,
										startAdornment: <Bitcoin size={20} />,
									}}
									aria-label="Enter amount"
								/>
							)}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<FormControl fullWidth>
							<InputLabel>Category</InputLabel>
							<Select
								value={formData.category}
								onChange={(e) =>
									setFormData({ ...formData, category: e.target.value })
								}
								label="Category"
								disabled={loading || filteredCategories.length === 0}
								aria-label="Select category"
							>
								{filteredCategories.length === 0 ? (
									<MenuItem value="" disabled>
										No matching categories
									</MenuItem>
								) : (
									filteredCategories.map((cat) => (
										<MenuItem key={cat.id} value={cat.id}>
											{cat.name} ({cat.type})
										</MenuItem>
									))
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField
							fullWidth
							label="Date"
							type="date"
							value={formData.date}
							onChange={(e) =>
								setFormData({ ...formData, date: e.target.value })
							}
							disabled={loading}
							InputLabelProps={{ shrink: true }}
							aria-label="Select date"
						/>
					</Grid>
					<Grid size={{ xs: 12 }}>
						<TextField
							fullWidth
							label="Description"
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							disabled={loading}
							multiline
							rows={2}
							aria-label="Enter description"
						/>
					</Grid>
					<Grid size={{ xs: 12 }}>
						<Stack direction="row" spacing={2} justifyContent="flex-end">
							{formData.id && onCancel && (
								<Button
									variant="outlined"
									onClick={onCancel}
									disabled={loading}
									sx={{ textTransform: "none", fontWeight: 500 }}
									aria-label="Cancel editing"
								>
									Cancel
								</Button>
							)}
							<Button
								variant="contained"
								onClick={handleSubmit}
								disabled={loading}
								startIcon={
									loading ? (
										<CircularProgress size={20} color="inherit" />
									) : null
								}
								sx={{ textTransform: "none", fontWeight: 500 }}
								aria-label={
									formData.id ? "Update transaction" : "Add transaction"
								}
							>
								{loading ? "Saving..." : formData.id ? "Update" : "Add"}
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default AddTransactionForm;
import { NextResponse } from "next/server";
