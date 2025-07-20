"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
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
import { JournalType, MoodType } from "@/types/interface";

interface JournalHistoryProps {
	journals: JournalType[];
	moods: MoodType[];
	loading: boolean;
	handleEdit: (journal: JournalType) => void;
	handleDelete: (id: string) => Promise<void>;
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
			date: string;
			mood: string;
		}>
	>;
}

const JournalHistory = forwardRef<
	{ journals: JournalType[] },
	JournalHistoryProps
>(
	(
		{
			journals,
			moods,
			loading,
			handleEdit,
			handleDelete,
			pagination,
			setPagination,
			setFilters,
		},
		ref
	) => {
		const [filter, setFilter] = useState({
			date: new Date().toISOString().split("T")[0].slice(0, 7), // YYYY-MM
			mood: "all",
		});

		// Expose journals via ref
		useImperativeHandle(ref, () => ({
			journals,
		}));

		// Reset filters and update parent
		const resetFilters = () => {
			const defaultFilters = {
				date: new Date().toISOString().split("T")[0].slice(0, 7),
				mood: "all",
			};
			setFilter(defaultFilters);
			setFilters(defaultFilters);
			setPagination((prev) => ({ ...prev, page: 1 }));
		};

		// Update parent filters
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

		// Generate page numbers
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
				if (leftBound > 2) pages.push("...");
				for (let i = leftBound; i <= rightBound; i++) {
					pages.push(i);
				}
				if (rightBound < totalPages - 1) pages.push("...");
				if (totalPages > 1) pages.push(totalPages);
			}
			return pages;
		};

		return (
			<Card sx={{ borderRadius: 2, boxShadow: 3, overflowX: "auto", mt: 4 }}>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
						Journal History
					</Typography>

					<Grid container spacing={2} sx={{ mb: 3 }}>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								fullWidth
								label="Date (YYYY-MM)"
								type="month"
								value={filter.date}
								onChange={(e) =>
									handleFilterChange({ date: e.target.value }, true)
								}
								disabled={loading}
								InputLabelProps={{ shrink: true }}
								aria-label="Select date"
							/>
						</Grid>

						<Grid size={{ xs: 12, sm: 6 }}>
							<FormControl fullWidth>
								<InputLabel>Mood</InputLabel>
								<Select
									value={filter.mood}
									onChange={(e) =>
										handleFilterChange({ mood: e.target.value }, true)
									}
									label="Mood"
									disabled={loading}
									aria-label="Select mood"
								>
									<MenuItem value="all">All</MenuItem>
									{moods.map((mood) => (
										<MenuItem key={mood.id} value={mood.id}>
											{mood.emoji} {mood.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid size={12}>
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
								<TableCell>Title</TableCell>
								<TableCell>Mood</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Content</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{journals.map((journal) => {
								const mood = moods.find((m) => m.id === journal.mood);
								return (
									<TableRow key={journal.id}>
										<TableCell>{journal.title}</TableCell>
										<TableCell>
											<Chip
												label={mood ? `${mood.emoji} ${mood.name}` : "Unknown"}
												size="small"
											/>
										</TableCell>
										<TableCell>
											{new Date(journal.date).toLocaleDateString()}
										</TableCell>
										<TableCell>{journal.content.slice(0, 50)}...</TableCell>
										<TableCell align="right">
											<IconButton
												onClick={() => handleEdit(journal)}
												disabled={loading}
												aria-label={`Edit journal ${journal.id}`}
											>
												<Edit size={20} />
											</IconButton>
											<IconButton
												onClick={() => handleDelete(journal.id)}
												disabled={loading}
												aria-label={`Delete journal ${journal.id}`}
											>
												<Trash2 size={20} color="red" />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
							{journals.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} align="center">
										No journal entries found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					{/* Pagination */}

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

JournalHistory.displayName = "JournalHistory";

export default JournalHistory;
