"use client";

import { useState } from "react";
import {
	Typography,
	TextField,
	Button,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Card,
	CardContent,
} from "@mui/material";
import dayjs from "dayjs";

interface Transaction {
	id: string;
	description: string;
	amount: number;
	type: "income" | "expense";
	date: Date;
}

export default function FinancePage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [type, setType] = useState<"income" | "expense">("income");

	const handleAddTransaction = () => {
		if (description && amount) {
			setTransactions([
				...transactions,
				{
					id: `TXN-${Date.now()}`,
					description,
					amount: parseFloat(amount),
					type,
					date: new Date(),
				},
			]);
			setDescription("");
			setAmount("");
		}
	};

	const totalIncome = transactions
		.filter((t) => t.type === "income")
		.reduce((sum, t) => sum + t.amount, 0);
	const totalExpense = transactions
		.filter((t) => t.type === "expense")
		.reduce((sum, t) => sum + t.amount, 0);

	return (
		<div>
			<Typography variant="h4" gutterBottom>
				Finance
			</Typography>
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<TextField
						label="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Amount"
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						fullWidth
						margin="normal"
					/>
					<TextField
						select
						label="Type"
						value={type}
						onChange={(e) => setType(e.target.value as "income" | "expense")}
						fullWidth
						margin="normal"
					>
						<MenuItem value="income">Income</MenuItem>
						<MenuItem value="expense">Expense</MenuItem>
					</TextField>
					<Button
						variant="contained"
						onClick={handleAddTransaction}
						sx={{ mt: 2 }}
					>
						Add Transaction
					</Button>
				</CardContent>
			</Card>
			<Typography variant="h6">Summary</Typography>
			<Typography>Income: ${totalIncome.toFixed(2)}</Typography>
			<Typography>Expense: ${totalExpense.toFixed(2)}</Typography>
			<Typography>
				Balance: ${(totalIncome - totalExpense).toFixed(2)}
			</Typography>
			<Table sx={{ mt: 2 }}>
				<TableHead>
					<TableRow>
						<TableCell>Description</TableCell>
						<TableCell>Amount</TableCell>
						<TableCell>Type</TableCell>
						<TableCell>Date</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{transactions.map((txn) => (
						<TableRow key={txn.id}>
							<TableCell>{txn.description}</TableCell>
							<TableCell>${txn.amount.toFixed(2)}</TableCell>
							<TableCell>{txn.type}</TableCell>
							<TableCell>{dayjs(txn.date).format("MMM D, YYYY")}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
