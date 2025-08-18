"use client";

import React, { useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext";
import { useQueryClient } from "@tanstack/react-query";

import { JournalType, MoodType, PaginationType } from "@/types/interface";
import { useJournalData } from "@/hooks/journal/useJournalData";
import { useJournalMutations } from "@/hooks/journal/useJournalMutations";
import { useJournalForm } from "@/hooks/journal/useJournalForm";
import JournalLayout from "@/components/journal/JournalLayout";

interface JournalFilters {
	period?: string;
	date?: string;
	mood?: string;
}

interface JournalPageClientProps {
	initialJournals: JournalType[];
	initialMoods: MoodType[];
	initialPagination: PaginationType;
}

const JournalPageClient: React.FC<JournalPageClientProps> = ({
	initialJournals,
	initialMoods,
	initialPagination,
}) => {
	const { showSnackbar } = useSnackbar();
	const queryClient = useQueryClient();
	const [journalFilters, setJournalFilters] = useState<JournalFilters>({
		period: "today",
		date: new Date().toISOString().slice(0, 7), // Current YYYY-MM
		mood: "all",
	});
	const [pagination, setPagination] =
		useState<PaginationType>(initialPagination);
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
		pagination: fetchedPagination,
	} = useJournalData({
		initialJournals,
		initialMoods,
		initialPagination,
		journalFilters,
		pagination,
	});

	const { addJournal, updateJournal, deleteJournal, isMutating } =
		useJournalMutations(
			(snackbar) => showSnackbar(snackbar),
			() => {
				setEditJournal(undefined);
				setSelectedJournal(null);
				setJournalFilters({
					period: "today",
					date: new Date().toISOString().slice(0, 7),
					mood: "all",
				});
			},
			moods
		);

	const { formData, errors, handleSubmit, handleChange } = useJournalForm({
		moods,
		initialData: editJournal
			? {
					id: editJournal.id,
					title: editJournal.title,
					content: editJournal.content,
					mood: editJournal.mood,
					date: editJournal.date.slice(0, 16),
			  }
			: undefined,
		onSubmit: async (data) => {
			if (data.id && !data.id.startsWith("temp-")) {
				await updateJournal(data);
			} else {
				await addJournal(data);
			}
		},
	});

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
		setSelectedJournal(journal);
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
				setSelectedJournal(null);
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
	};

	const handleCancel = () => {
		setEditJournal(undefined);
		setSelectedJournal(null);
	};

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
			journalFilters={journalFilters}
			setJournalFilters={setJournalFilters}
			pagination={fetchedPagination}
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
		/>
	);
};

export default JournalPageClient;
