"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CircularProgress, Box, Button, Typography } from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext";
import {
	JournalType,
	MoodType,
	PaginationType,
	JournalFilters,
} from "@/types/interface";
import { useJournalData } from "@/hooks/journal/useJournalData";
import { useJournalMutations } from "@/hooks/journal/useJournalMutations";
import { useJournalForm } from "@/hooks/journal/useJournalForm";
import JournalLayout from "@/components/journal/JournalLayout";
import { fetchJournals } from "@/utils/apiJournal";

interface JournalPageClientProps {
	initialJournals: JournalType[];
	initialMoods: MoodType[];
	initialPagination: PaginationType;
	initialError: string | null;
}

const JournalPageClient: React.FC<JournalPageClientProps> = ({
	initialJournals,
	initialMoods,
	initialPagination,
	initialError,
}) => {
	const { showSnackbar } = useSnackbar();
	const [filters, setFilters] = useState<JournalFilters>({
		date: "",
		mood: "all",
		period: "all",
	});
	const [pagination, setPagination] = useState<PaginationType>({
		...initialPagination,
		page: 1,
		limit: initialPagination.limit || 10,
	});
	const [editJournal, setEditJournal] = useState<JournalType | undefined>(
		undefined
	);
	const [selectedJournal, setSelectedJournal] = useState<JournalType | null>(
		null
	);

	const {
		journals,
		moods,
		isLoading,
		pagination: serverPagination,
	} = useJournalData({
		initialJournals,
		initialMoods,
		initialPagination,
		pagination,
		filters,
	});

	// Set the most recent journal as default selectedJournal if none is selected
	useEffect(() => {
		if (!selectedJournal && !editJournal && journals.length > 0) {
			const mostRecentJournal = journals.reduce((latest, journal) => {
				return !latest || new Date(journal.date) > new Date(latest.date)
					? journal
					: latest;
			}, journals[0]);
			setSelectedJournal(mostRecentJournal);
		}
	}, [journals, selectedJournal, editJournal]);

	const { addJournal, updateJournal, deleteJournal, isMutating } =
		useJournalMutations({
			setSnackbar: showSnackbar,
			resetForm: () => {
				setEditJournal(undefined);
				setSelectedJournal(null); // Will trigger default selection in useEffect
			},
			moods,
			pagination,
			journalFilters: filters,
		});

	const initialFormData = useMemo(
		() =>
			editJournal
				? {
						id: editJournal.id,
						title: editJournal.title,
						content: editJournal.content,
						mood: editJournal.mood,
						date: editJournal.date.split("T")[0], // Convert ISO date to YYYY-MM-DD
				  }
				: undefined,
		[
			editJournal?.id,
			editJournal?.title,
			editJournal?.content,
			editJournal?.mood,
			editJournal?.date,
		]
	);

	const { formData, errors, handleChange, handleSubmit, resetForm } =
		useJournalForm({
			moods,
			initialData: initialFormData,
			onSubmit: async (data) => {
				try {
					if (data.id && !data.id.startsWith("temp-")) {
						await updateJournal(data);
					} else {
						await addJournal(data);
					}
				} catch (error: any) {
					showSnackbar({
						open: true,
						message:
							error.message ||
							(data.id ? "Failed to update journal" : "Failed to add journal"),
						severity: "error",
					});
				}
			},
		});

	useEffect(() => {
		if (initialError) {
			showSnackbar({
				open: true,
				message: `${initialError}. Displaying sample data.`,
				severity: "error",
			});
		}
	}, [initialError, showSnackbar]);

	useEffect(() => {
		setPagination((prev) => ({
			...prev,
			total: serverPagination.total,
			totalPages: serverPagination.totalPages,
		}));
	}, [serverPagination]);

	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const now = new Date();
				const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
				const journalsToNotify = await fetchJournals({
					dateTimeRange: {
						start: now.toISOString(),
						end: inOneHour.toISOString(),
					},
				});
				for (const journal of journalsToNotify.data) {
					const journalTime = new Date(journal.date);
					if (
						now >= journalTime &&
						now <= new Date(journalTime.getTime() + 60 * 1000)
					) {
						showSnackbar({
							open: true,
							message: `Reminder: Journal "${journal.title}" is due now!`,
							severity: "warning",
						});
					}
				}
			} catch (error: any) {
				console.error("Error checking journal notifications:", error);
			}
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, [showSnackbar]);

	const handleEditJournal = (journal: JournalType) => {
		if (!journal || !journal.id) {
			showSnackbar({
				open: true,
				message: "Invalid journal data",
				severity: "error",
			});
			return;
		}
		setEditJournal(journal);
		setSelectedJournal(null);
		showSnackbar({
			open: true,
			message: "Journal loaded for editing",
			severity: "success",
		});
	};

	const handleDeleteJournal = async (id: string) => {
		try {
			await deleteJournal(id);
			if (selectedJournal?.id === id) {
				setSelectedJournal(null); // Will trigger default selection in useEffect
			}
		} catch (error: any) {
			showSnackbar({
				open: true,
				message: error.message || "Failed to delete journal",
				severity: "error",
			});
		}
	};

	const handleSelectJournal = (journal: JournalType) => {
		setSelectedJournal(journal);
		setEditJournal(undefined);
	};

	const handleCancel = () => {
		setEditJournal(undefined);
		setSelectedJournal(null); // Will trigger default selection in useEffect
		resetForm(); // Reset the form fields
	};

	if (initialError) {
		return (
			<Box sx={{ textAlign: "center", py: 4, color: "white" }}>
				<Typography color="error">{initialError}</Typography>
				<Typography sx={{ mt: 1, color: "rgba(255, 255, 255, 0.7)" }}>
					Showing sample data. Please try again later.
				</Typography>
				<Button
					onClick={() => window.location.reload()}
					variant="contained"
					sx={{ mt: 2, backgroundColor: "#3d2352", color: "white" }}
				>
					Retry
				</Button>
				<JournalLayout
					journals={journals}
					moods={moods}
					isLoading={isLoading}
					pagination={pagination}
					setPagination={setPagination}
					handleEditJournal={handleEditJournal}
					handleDeleteJournal={handleDeleteJournal}
					handleSelectJournal={handleSelectJournal}
					handleCancel={handleCancel}
					initialJournalData={editJournal}
					selectedJournal={selectedJournal}
					formData={formData}
					formErrors={errors}
					handleFormChange={handleChange}
					handleSubmit={handleSubmit}
					filters={filters}
					setFilters={setFilters}
				/>
			</Box>
		);
	}

	if (isLoading && !journals.length) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<JournalLayout
			journals={journals}
			moods={moods}
			isLoading={isLoading || isMutating}
			pagination={pagination}
			setPagination={setPagination}
			handleEditJournal={handleEditJournal}
			handleDeleteJournal={handleDeleteJournal}
			handleSelectJournal={handleSelectJournal}
			handleCancel={handleCancel}
			initialJournalData={editJournal}
			selectedJournal={selectedJournal}
			formData={formData}
			formErrors={errors}
			handleFormChange={handleChange}
			handleSubmit={handleSubmit}
			filters={filters}
			setFilters={setFilters}
		/>
	);
};

export default JournalPageClient;
