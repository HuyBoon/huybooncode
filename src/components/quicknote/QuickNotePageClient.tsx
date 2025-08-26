"use client";
import React, { useState, useEffect, useMemo } from "react";
import { CircularProgress, Box, Button, Typography } from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext";
import {
	QuickNoteType,
	PaginationType,
	QuickNoteFilters,
} from "@/types/interface";
import { useQuickNoteData } from "@/hooks/quicknote/useQuickNoteData";
import { useQuickNoteMutations } from "@/hooks/quicknote/useQuickNoteMutations";
import { useQuickNoteForm } from "@/hooks/quicknote/useQuickNoteForm";
import QuickNoteLayout from "@/components/quicknote/QuickNoteLayout";
import { fetchQuickNotes } from "@/utils/apiQuickNote";

interface QuickNotePageClientProps {
	initialQuickNotes: QuickNoteType[];
	initialPagination: PaginationType;
	initialError: string | null;
}

const QuickNotePageClient: React.FC<QuickNotePageClientProps> = ({
	initialQuickNotes,
	initialPagination,
	initialError,
}) => {
	const { showSnackbar } = useSnackbar();
	const [filters, setFilters] = useState<QuickNoteFilters>({
		date: "",
		period: "all",
		category: "all",
	});
	const [pagination, setPagination] = useState<PaginationType>({
		...initialPagination,
		page: 1,
		limit: initialPagination.limit || 10,
	});
	const [editQuickNote, setEditQuickNote] = useState<QuickNoteType | undefined>(
		undefined
	);
	const [selectedQuickNote, setSelectedQuickNote] =
		useState<QuickNoteType | null>(null);

	const {
		quickNotes,
		isLoading,
		pagination: serverPagination,
	} = useQuickNoteData({
		initialQuickNotes,
		initialPagination,
		pagination,
		filters,
	});

	useEffect(() => {
		if (!selectedQuickNote && !editQuickNote && quickNotes.length > 0) {
			const mostRecentQuickNote = quickNotes.reduce((latest, note) => {
				return !latest || new Date(note.date) > new Date(latest.date)
					? note
					: latest;
			}, quickNotes[0]);
			setSelectedQuickNote(mostRecentQuickNote);
		}
	}, [quickNotes, selectedQuickNote, editQuickNote]);

	const { addQuickNote, updateQuickNote, deleteQuickNote, isMutating } =
		useQuickNoteMutations({
			setSnackbar: showSnackbar,
			resetForm: () => {
				setEditQuickNote(undefined);
				setSelectedQuickNote(null);
			},
			pagination,
			quickNoteFilters: filters,
		});

	const initialFormData = useMemo(
		() =>
			editQuickNote
				? {
						id: editQuickNote.id,
						content: editQuickNote.content,
						date: editQuickNote.date.split("T")[0],
						category: editQuickNote.category,
				  }
				: undefined,
		[editQuickNote]
	);

	const { formData, errors, handleChange, handleSubmit, resetForm } =
		useQuickNoteForm({
			initialData: initialFormData,
			onSubmit: async (data) => {
				try {
					if (
						typeof data.id === "string" &&
						data.id &&
						!data.id.startsWith("temp-")
					) {
						await updateQuickNote({
							id: data.id,
							content: data.content,
							date: data.date,
							category: data.category,
						});
					} else {
						await addQuickNote(data);
					}
				} catch (error: any) {
					showSnackbar({
						open: true,
						message:
							error.message ||
							(data.id
								? "Failed to update quick note"
								: "Failed to add quick note"),
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
				const quickNotesToNotify = await fetchQuickNotes({
					dateTimeRange: {
						start: now.toISOString(),
						end: inOneHour.toISOString(),
					},
				});
				for (const note of quickNotesToNotify.data) {
					const noteTime = new Date(note.date);
					if (
						now >= noteTime &&
						now <= new Date(noteTime.getTime() + 60 * 1000)
					) {
						showSnackbar({
							open: true,
							message: `Reminder: Quick note "${note.content.substring(
								0,
								20
							)}..." is due now!`,
							severity: "warning",
						});
					}
				}
			} catch (error: any) {
				console.error("Error checking quick note notifications:", error);
			}
		}, 60 * 1000);
		return () => clearInterval(interval);
	}, [showSnackbar]);

	const handleEditQuickNote = (quickNote: QuickNoteType) => {
		if (!quickNote || !quickNote.id) {
			showSnackbar({
				open: true,
				message: "Invalid quick note data",
				severity: "error",
			});
			return;
		}
		setEditQuickNote(quickNote);
		setSelectedQuickNote(null);
		showSnackbar({
			open: true,
			message: "Quick note loaded for editing",
			severity: "success",
		});
	};

	const handleDeleteQuickNote = async (id: string) => {
		try {
			await deleteQuickNote(id);
			if (selectedQuickNote?.id === id) {
				setSelectedQuickNote(null);
			}
		} catch (error: any) {
			showSnackbar({
				open: true,
				message: error.message || "Failed to delete quick note",
				severity: "error",
			});
		}
	};

	const handleSelectQuickNote = (quickNote: QuickNoteType) => {
		setSelectedQuickNote(quickNote);
		setEditQuickNote(undefined);
	};

	const handleCancel = () => {
		setEditQuickNote(undefined);
		setSelectedQuickNote(null);
		resetForm();
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
				<QuickNoteLayout
					quickNotes={quickNotes}
					isLoading={isLoading}
					pagination={pagination}
					setPagination={setPagination}
					handleEditQuickNote={handleEditQuickNote}
					handleDeleteQuickNote={handleDeleteQuickNote}
					handleSelectQuickNote={handleSelectQuickNote}
					handleCancel={handleCancel}
					initialQuickNoteData={editQuickNote}
					selectedQuickNote={selectedQuickNote}
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

	if (isLoading && !quickNotes.length) {
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
		<QuickNoteLayout
			quickNotes={quickNotes}
			isLoading={isLoading || isMutating}
			pagination={pagination}
			setPagination={setPagination}
			handleEditQuickNote={handleEditQuickNote}
			handleDeleteQuickNote={handleDeleteQuickNote}
			handleSelectQuickNote={handleSelectQuickNote}
			handleCancel={handleCancel}
			initialQuickNoteData={editQuickNote}
			selectedQuickNote={selectedQuickNote}
			formData={formData}
			formErrors={errors}
			handleFormChange={handleChange}
			handleSubmit={handleSubmit}
			filters={filters}
			setFilters={setFilters}
		/>
	);
};

export default QuickNotePageClient;
