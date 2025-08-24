"use client";

import React from "react";
import { Box, Typography, Card, Grid } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import AddJournalForm from "@/components/journal/AddJournalForm";
import JournalHistory from "@/components/journal/JournalHistory";
import JournalDetail from "@/components/journal/JournalDetail";
import {
	JournalType,
	MoodType,
	PaginationType,
	JournalFilters,
} from "@/types/interface";

interface FormData {
	id?: string;
	title: string;
	content: string;
	mood: string;
	date: string;
}

interface FormErrors {
	title?: string;
	content?: string;
	mood?: string;
	date?: string;
}

interface JournalLayoutProps {
	journals: JournalType[];
	moods: MoodType[];
	isLoading: boolean;
	pagination: PaginationType;
	setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
	handleEditJournal: (journal: JournalType) => void;
	handleDeleteJournal: (id: string) => void;
	handleSelectJournal: (journal: JournalType) => void;
	handleCancel: () => void;
	initialJournalData?: JournalType;
	selectedJournal: JournalType | null;
	formData: FormData;
	formErrors: FormErrors;
	handleFormChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| SelectChangeEvent<string>
	) => void;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
	filters: JournalFilters;
	setFilters: React.Dispatch<React.SetStateAction<JournalFilters>>;
}

const JournalLayout: React.FC<JournalLayoutProps> = ({
	journals,
	moods,
	isLoading,
	pagination,
	setPagination,
	handleEditJournal,
	handleDeleteJournal,
	handleSelectJournal,
	handleCancel,
	initialJournalData,
	selectedJournal,
	formData,
	formErrors,
	handleFormChange,
	handleSubmit,
	filters,
	setFilters,
}) => {
	return (
		<Box
			sx={{
				maxWidth: "1400px",
				mx: "auto",
				mt: 4,
				mb: 4,
				bgcolor: "transparent",
			}}
		>
			<Grid container spacing={{ xs: 2, sm: 3 }}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #2e003e, #3d2352, #1b1b2f)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							display: "flex",
							flexDirection: "column",
							minHeight: { xs: "300px", sm: "350px", md: "550px" },
						}}
					>
						<Box
							sx={{
								background: "transparent",
								boxShadow: "none",
								display: "flex",
								flexDirection: "column",
								height: "100%",
								minHeight: { xs: "300px", sm: "350px", md: "550px" },
							}}
						>
							<Typography variant="h6" sx={{ px: 3, pt: 3, color: "white" }}>
								{initialJournalData ? "Edit Journal" : "Add New Journal"}
							</Typography>
							<AddJournalForm
								moods={moods}
								initialData={initialJournalData}
								onSubmit={handleSubmit}
								onCancel={handleCancel}
								formData={formData}
								formErrors={formErrors}
								handleChange={handleFormChange}
							/>
						</Box>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							display: "flex",
							flexDirection: "column",
							minHeight: { xs: "300px", sm: "350px", md: "550px" },
						}}
					>
						<Box
							sx={{
								background: "transparent",
								boxShadow: "none",
								display: "flex",
								flexDirection: "column",
								height: "100%",
								minHeight: { xs: "300px", sm: "350px", md: "550px" },
							}}
						>
							<JournalDetail journal={selectedJournal} />
						</Box>
					</Card>
				</Grid>
				<Grid size={{ xs: 12 }}>
					<Card
						sx={{
							borderRadius: "24px",
							overflow: "hidden",
							background: "linear-gradient(135deg, #5e35b1 0%, #4527a0 100%)",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
							display: "flex",
							flexDirection: "column",
							minHeight: { xs: "300px", sm: "350px", md: "400px" },
						}}
					>
						<Box
							sx={{
								background: "transparent",
								boxShadow: "none",
								display: "flex",
								flexDirection: "column",
								height: "100%",
								minHeight: { xs: "300px", sm: "350px", md: "400px" },
							}}
						>
							<JournalHistory
								journals={journals}
								moods={moods}
								initialPagination={pagination}
								handleEdit={handleEditJournal}
								handleDelete={handleDeleteJournal}
								handleSelectJournal={handleSelectJournal}
								loading={isLoading}
								pagination={pagination}
								setPagination={setPagination}
								filters={filters}
								setFilters={setFilters}
							/>
						</Box>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default JournalLayout;
