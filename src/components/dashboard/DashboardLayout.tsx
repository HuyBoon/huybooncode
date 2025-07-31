"use client";

import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import AddTransactionFormNew from "@/components/finance/AddTransactionFormNew";
import { FinanceType, FinanceCategoryType } from "@/types/interface";

interface DashboardProps {
	initialFinances: FinanceType[];
	initialCategories: FinanceCategoryType[];
	onTransactionAdded?: (newTransaction: FinanceType) => void; // Optional callback for parent updates
}

const DashboardLayout: React.FC<DashboardProps> = ({
	initialFinances,
	initialCategories,
	onTransactionAdded,
}) => {
	const [loading, setLoading] = useState(false);

	console.log("initialFinances in Dashboard:", initialFinances);
	console.log("initialCategories in Dashboard:", initialCategories);

	const handleAddTransaction = async (data: {
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
	}) => {
		setLoading(true);
		try {
			console.log("Adding transaction:", data);
			// Example API call: await api.addTransaction(data);
			// Simulate adding transaction
			const newTransaction: FinanceType = {
				id: data.id || crypto.randomUUID(), // Generate ID if not provided
				type: data.type,
				amount: data.amount,
				category: data.category,
				description: data.description,
				date: data.date,
				createdAt: new Date().toISOString(), // Add createdAt timestamp
				updatedAt: new Date().toISOString(), // Add updatedAt timestamp
			};
			// Notify parent if callback is provided
			onTransactionAdded?.(newTransaction);
		} catch (error) {
			console.error("Error adding transaction:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", py: 4, px: { xs: 2, sm: 3 } }}>
			<Typography
				variant="h4"
				sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
			>
				Dashboard
			</Typography>

			<Grid container spacing={3}>
				{/* Finance Section */}
				<Grid size={{ xs: 12 }}>
					<Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
						<CardContent sx={{ p: { xs: 2, sm: 3 } }}>
							<Typography
								variant="h6"
								sx={{
									fontWeight: 700,
									mb: 2,
									fontSize: { xs: "1.1rem", sm: "1.25rem" },
								}}
							>
								Add New Transaction
							</Typography>
							<AddTransactionFormNew
								categories={initialCategories}
								loading={loading}
								onSubmit={handleAddTransaction}
							/>
						</CardContent>
					</Card>
				</Grid>

				{/* Placeholder for Future Sections */}
				<Grid size={{ xs: 12 }}>
					<Card
						sx={{
							height: "100%",
							textAlign: "center",
							py: 2,
							boxShadow: 3,
							borderRadius: 2,
						}}
					>
						<CardContent>
							<Typography variant="body1" color="text.secondary">
								More sections (ToDoList, Events, Journal, Blog) will be added
								here soon.
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default DashboardLayout;
