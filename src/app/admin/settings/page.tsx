"use client";

import React, { useState } from "react";
import {
	Box,
	Typography,
	Button,
	Snackbar,
	Alert,
	Grid,
	Paper,
	Stack,
	CircularProgress,
} from "@mui/material";

const SettingPage = () => {
	const [loading, setLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error",
	});

	const showSnackbar = (message: string, severity: "success" | "error") => {
		setSnackbar({ open: true, message, severity });
	};

	const apiAction = async (
		url: string,
		method: "POST" | "DELETE",
		successMsg: string,
		errorMsg: string,
		setLoadingFn: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		setLoadingFn(true);
		try {
			const res = await fetch(url, { method });
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.details || errorData.error || errorMsg);
			}
			const result = await res.json();
			const message = Array.isArray(result)
				? successMsg
				: result.message || successMsg;
			showSnackbar(message, "success");
		} catch (error) {
			showSnackbar(error instanceof Error ? error.message : errorMsg, "error");
		} finally {
			setLoadingFn(false);
		}
	};

	const handleSeedCategories = () =>
		apiAction(
			"/api/finance-categories/seed",
			"POST",
			"Categories seeded successfully",
			"Failed to seed categories",
			setLoading
		);

	const handleDeleteAllCategories = () => {
		if (window.confirm("Are you sure you want to delete all categories?")) {
			apiAction(
				"/api/finance-categories/delete-all",
				"DELETE",
				"All categories deleted successfully",
				"Failed to delete categories",
				setIsDeleting
			);
		}
	};

	const handleResetFinance = () => {
		if (
			window.confirm("Are you sure you want to delete all finance records?")
		) {
			apiAction(
				"/api/finances/delete-all",
				"DELETE",
				"All finance records deleted",
				"Failed to delete finances",
				setIsDeleting
			);
		}
	};

	const handleResetTodos = () => {
		if (window.confirm("Are you sure you want to delete all todos?")) {
			apiAction(
				"/api/todos/delete-all",
				"DELETE",
				"All todos deleted",
				"Failed to delete todos",
				setIsDeleting
			);
		}
	};

	const handleResetJournals = () => {
		if (
			window.confirm("Are you sure you want to delete all journal entries?")
		) {
			apiAction(
				"/api/journals/delete-all",
				"DELETE",
				"All journal entries deleted",
				"Failed to delete journals",
				setIsDeleting
			);
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	return (
		<Box sx={{ maxWidth: 800, mx: "auto", py: 6, px: { xs: 2, sm: 3 } }}>
			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				sx={{ fontWeight: 700, color: "text.primary" }}
			>
				Admin Tools - HuyBoonCode
			</Typography>

			<Paper
				elevation={4}
				sx={{
					p: { xs: 2, sm: 3 },
					borderRadius: 2,
					bgcolor: "background.paper",
				}}
			>
				<Grid container spacing={3}>
					{/* Finance Categories Row */}
					<Grid size={{ xs: 12, sm: 4, md: 3 }}>
						<Typography
							variant="body1"
							sx={{ fontWeight: 600, color: "text.primary" }}
							aria-label="Finance Categories"
						>
							Finance Categories
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, sm: 8, md: 9 }}>
						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={2}
							sx={{ alignItems: { xs: "stretch", sm: "center" } }}
						>
							<Button
								variant="contained"
								onClick={handleSeedCategories}
								disabled={loading}
								startIcon={
									loading ? (
										<CircularProgress size={20} color="inherit" />
									) : null
								}
								sx={{
									minWidth: { xs: "100%", sm: 160 },
									py: 1,
									textTransform: "none",
									fontWeight: 500,
								}}
								aria-label="Seed default finance categories"
							>
								{loading ? "Seeding..." : "Seed Default"}
							</Button>
							<Button
								variant="outlined"
								color="error"
								onClick={handleDeleteAllCategories}
								disabled={isDeleting}
								sx={{
									minWidth: { xs: "100%", sm: 160 },
									py: 1,
									textTransform: "none",
									fontWeight: 500,
								}}
								aria-label="Delete all finance categories"
							>
								Delete All
							</Button>
						</Stack>
					</Grid>

					{/* Finance Records Row */}
					<Grid size={{ xs: 12, sm: 4, md: 3 }}>
						<Typography
							variant="body1"
							sx={{ fontWeight: 600, color: "text.primary" }}
							aria-label="Finance Records"
						>
							Finance Records
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, sm: 8, md: 9 }}>
						<Button
							variant="outlined"
							color="error"
							onClick={handleResetFinance}
							disabled={isDeleting}
							sx={{
								minWidth: { xs: "100%", sm: 160 },
								py: 1,
								textTransform: "none",
								fontWeight: 500,
							}}
							aria-label="Delete all finance records"
						>
							Delete All
						</Button>
					</Grid>

					{/* To-do List Row */}
					<Grid size={{ xs: 12, sm: 4, md: 3 }}>
						<Typography
							variant="body1"
							sx={{ fontWeight: 600, color: "text.primary" }}
							aria-label="To-do List"
						>
							To-do List
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, sm: 8, md: 9 }}>
						<Button
							variant="outlined"
							color="error"
							onClick={handleResetTodos}
							disabled={isDeleting}
							sx={{
								minWidth: { xs: "100%", sm: 160 },
								py: 1,
								textTransform: "none",
								fontWeight: 500,
							}}
							aria-label="Delete all to-do items"
						>
							Delete All
						</Button>
					</Grid>

					{/* Journals Row */}
					<Grid size={{ xs: 12, sm: 4, md: 3 }}>
						<Typography
							variant="body1"
							sx={{ fontWeight: 600, color: "text.primary" }}
							aria-label="Journals"
						>
							Journals
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, sm: 8, md: 9 }}>
						<Button
							variant="outlined"
							color="error"
							onClick={handleResetJournals}
							disabled={isDeleting}
							sx={{
								minWidth: { xs: "100%", sm: 160 },
								py: 1,
								textTransform: "none",
								fontWeight: 500,
							}}
							aria-label="Delete all journal entries"
						>
							Delete All
						</Button>
					</Grid>
				</Grid>
			</Paper>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
					variant="filled"
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default SettingPage;
