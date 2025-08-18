import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import AddJournalForm from "@/components/journal/AddJournalForm";
import JournalHistory from "@/components/journal/JournalHistory";
import JournalDetail from "@/components/journal/JournalDetail";
import { JournalType, MoodType, PaginationType } from "@/types/interface";

interface JournalFilters {
	period?: string;
	date?: string;
	mood?: string;
}

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
	journalFilters: JournalFilters;
	setJournalFilters: (filters: JournalFilters) => void;
	pagination: PaginationType;
	setPagination: (pagination: PaginationType) => void;
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
}

const JournalLayout: React.FC<JournalLayoutProps> = ({
	journals,
	moods,
	isLoading,
	journalFilters,
	setJournalFilters,
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
}) => {
	return (
		<Box sx={{ p: 4, maxWidth: "1400px", mx: "auto" }}>
			<Typography variant="h4" gutterBottom>
				Journal Management
			</Typography>
			<Grid container spacing={4}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						sx={{ mb: 4, minHeight: { xs: "300px", sm: "350px", md: "400px" } }}
					>
						<CardContent>
							<AddJournalForm
								moods={moods}
								initialData={initialJournalData}
								onSubmit={handleSubmit}
								onCancel={handleCancel}
								formData={formData}
								formErrors={formErrors}
								handleChange={handleFormChange}
							/>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						sx={{ mb: 4, minHeight: { xs: "300px", sm: "350px", md: "400px" } }}
					>
						<CardContent>
							<JournalDetail journal={selectedJournal} />
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Card sx={{ mb: 4 }}>
				<CardContent>
					<JournalHistory
						journals={journals}
						period={journalFilters.period || "today"}
						setPeriod={(period) =>
							setJournalFilters({ ...journalFilters, period })
						}
					/>
				</CardContent>
			</Card>
			<Box>
				<Typography variant="h5" gutterBottom>
					Journals
				</Typography>
				{isLoading ? (
					<Typography>Loading...</Typography>
				) : (
					journals.map((journal) => (
						<Card key={journal.id} sx={{ mb: 2, cursor: "pointer" }}>
							<CardContent onClick={() => handleSelectJournal(journal)}>
								<Typography variant="h6">{journal.title}</Typography>
								<Typography>{journal.content}</Typography>
								<Typography>Mood: {journal.mood}</Typography>
								<Typography>
									Date: {new Date(journal.date).toLocaleString()}
								</Typography>
								<Box sx={{ mt: 2, display: "flex", gap: 2 }}>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleEditJournal(journal);
										}}
										className="text-blue-600 hover:underline"
									>
										Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteJournal(journal.id);
										}}
										className="text-red-600 hover:underline"
									>
										Delete
									</button>
								</Box>
							</CardContent>
						</Card>
					))
				)}
				{journals.length === 0 && !isLoading && (
					<Typography>No journals found</Typography>
				)}
			</Box>
		</Box>
	);
};

export default JournalLayout;
