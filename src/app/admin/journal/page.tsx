"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	TextField,
	MenuItem,
	Typography,
	Snackbar,
	Alert,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	Stack,
} from "@mui/material";
import { Pen } from "lucide-react";
import { JournalType, MoodType } from "@/types/interface";
import JournalSummary from "@/components/admin/JournalSummary";
import JournalHistory from "@/components/admin/JournalHistory";
import Loader from "@/components/admin/Loader";

const JournalPage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [journals, setJournals] = useState<JournalType[]>([]);
	const [moods, setMoods] = useState<MoodType[]>([]);
	const [formData, setFormData] = useState({
		id: null as string | null,
		title: "",
		content: "",
		mood: "",
		date: new Date().toISOString().split("T")[0],
	});
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error",
	});
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 1,
	});
	const [filters, setFilters] = useState({
		date: new Date().toISOString().split("T")[0].slice(0, 7), // YYYY-MM
		mood: "all",
	});
	const journalHistoryRef = useRef<{ journals: JournalType[] }>({
		journals: [],
	});

	// Fetch moods and journals
	useEffect(() => {
		const fetchMoods = async () => {
			try {
				const response = await fetch("/api/moods");
				if (response.ok) {
					const data = await response.json();
					setMoods(data);
				} else {
					setSnackbar({
						open: true,
						message: "Failed to fetch moods",
						severity: "error",
					});
				}
			} catch (error) {
				setSnackbar({
					open: true,
					message: "Error fetching moods",
					severity: "error",
				});
			}
		};

		const fetchJournals = async () => {
			try {
				const { page, limit } = pagination;
				const { date, mood } = filters;
				const params = new URLSearchParams({
					page: page.toString(),
					limit: limit.toString(),
					date,
					...(mood !== "all" && { mood }),
				});
				const response = await fetch(`/api/journal?${params}`);
				if (response.ok) {
					const { data, pagination: newPagination } = await response.json();
					setJournals(data);
					setPagination((prev) => ({ ...prev, ...newPagination }));
				} else {
					setSnackbar({
						open: true,
						message: "Failed to fetch journals",
						severity: "error",
					});
				}
			} catch (error) {
				setSnackbar({
					open: true,
					message: "Error fetching journals",
					severity: "error",
				});
			}
		};

		fetchMoods().then(() => fetchJournals());
	}, [pagination.page, pagination.limit, filters]);

	// Handle form submission
	const handleSubmit = async () => {
		if (
			!formData.title ||
			!formData.content ||
			!formData.mood ||
			!formData.date
		) {
			setSnackbar({
				open: true,
				message: "All fields are required",
				severity: "error",
			});
			return;
		}

		setLoading(true);
		const body = {
			title: formData.title,
			content: formData.content,
			mood: formData.mood,
			date: formData.date,
		};

		try {
			const url = isEditing ? `/api/journal/${formData.id}` : "/api/journal";
			const response = await fetch(url, {
				method: isEditing ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (response.ok) {
				const updatedJournal = await response.json();
				setJournals((prev) =>
					isEditing
						? prev.map((j) => (j.id === updatedJournal.id ? updatedJournal : j))
						: [...prev, updatedJournal]
				);
				setSnackbar({
					open: true,
					message: isEditing ? "Journal updated!" : "Journal added!",
					severity: "success",
				});
				resetForm();
			} else {
				const errorData = await response.json();
				setSnackbar({
					open: true,
					message: errorData.error || "Failed to save journal",
					severity: "error",
				});
			}
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Error saving journal",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	// Handle edit
	const handleEdit = (journal: JournalType) => {
		setFormData({
			id: journal.id,
			title: journal.title,
			content: journal.content,
			mood: journal.mood,
			date: journal.date,
		});
		setIsEditing(true);
	};

	// Handle delete
	const handleDelete = async (id: string) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/journal/${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			});
			if (response.ok) {
				setJournals((prev) => prev.filter((j) => j.id !== id));
				setPagination((prev) => ({
					...prev,
					total: prev.total - 1,
					totalPages: Math.ceil((prev.total - 1) / prev.limit),
				}));
				setSnackbar({
					open: true,
					message: "Journal deleted!",
					severity: "success",
				});
			} else {
				const errorData = await response.json();
				setSnackbar({
					open: true,
					message: errorData.error || "Failed to delete journal",
					severity: "error",
				});
			}
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Error deleting journal",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			id: null,
			title: "",
			content: "",
			mood: "",
			date: new Date().toISOString().split("T")[0],
		});
		setIsEditing(false);
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	if (status === "loading") {
		return <Loader />;
	}

	if (status === "unauthenticated") {
		router.push("/login");
		return null;
	}

	return (
		<Box sx={{ maxWidth: "lg", mx: "auto", py: 6, px: { xs: 2, sm: 3 } }}>
			<Typography
				variant="h4"
				component="h1"
				sx={{ fontWeight: 700, mb: 4, color: "text.primary" }}
			>
				Manage Journal
			</Typography>

			{/* Summary */}
			<JournalSummary journals={journals} />

			{/* Form */}
			<Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
				<CardContent>
					<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
						{isEditing ? "Edit Journal Entry" : "Add Journal Entry"}
					</Typography>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								fullWidth
								label="Title"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								disabled={loading}
								aria-label="Enter title"
							/>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<FormControl fullWidth>
								<InputLabel>Mood</InputLabel>
								<Select
									value={formData.mood}
									onChange={(e) =>
										setFormData({ ...formData, mood: e.target.value })
									}
									label="Mood"
									disabled={loading || moods.length === 0}
									aria-label="Select mood"
								>
									{moods.length === 0 ? (
										<MenuItem value="" disabled>
											No moods available
										</MenuItem>
									) : (
										moods.map((mood) => (
											<MenuItem key={mood.id} value={mood.id}>
												{mood.emoji} {mood.name}
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
								label="Content"
								value={formData.content}
								onChange={(e) =>
									setFormData({ ...formData, content: e.target.value })
								}
								disabled={loading}
								multiline
								rows={4}
								aria-label="Enter content"
							/>
						</Grid>
						<Grid size={{ xs: 12 }}>
							<Stack direction="row" spacing={2} justifyContent="flex-end">
								{isEditing && (
									<Button
										variant="outlined"
										onClick={resetForm}
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
										) : (
											<Pen size={20} />
										)
									}
									sx={{ textTransform: "none", fontWeight: 500 }}
									aria-label={
										isEditing ? "Update journal entry" : "Add journal entry"
									}
								>
									{loading ? "Saving..." : isEditing ? "Update" : "Add"}
								</Button>
							</Stack>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Journal History */}
			<JournalHistory
				journals={journals}
				moods={moods}
				loading={loading}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
				pagination={pagination}
				setPagination={setPagination}
				setFilters={setFilters}
				ref={journalHistoryRef}
			/>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default JournalPage;
