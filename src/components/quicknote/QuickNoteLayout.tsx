import React from "react";
import { Box, Card, Grid, Typography } from "@mui/material";
import AddQuickNoteForm from "@/components/quicknote/AddQuickNoteForm";
import QuickNoteHistory from "@/components/quicknote/QuickNoteHistory";
import QuickNoteDetail from "@/components/quicknote/QuickNoteDetail";
import {
	QuickNoteType,
	PaginationType,
	QuickNoteFilters,
} from "@/types/interface";

interface FormData {
	id?: string;
	content: string;
	date: string;
	category: string;
}

interface FormErrors {
	content?: string;
	date?: string;
	category?: string;
}

interface QuickNoteLayoutProps {
	quickNotes: QuickNoteType[];
	isLoading: boolean;
	pagination: PaginationType;
	setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
	handleEditQuickNote: (quickNote: QuickNoteType) => void;
	handleDeleteQuickNote: (id: string) => void;
	handleSelectQuickNote: (quickNote: QuickNoteType) => void;
	handleCancel: () => void;
	initialQuickNoteData?: QuickNoteType;
	selectedQuickNote: QuickNoteType | null;
	formData: FormData;
	formErrors: FormErrors;
	handleFormChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| import("@mui/material").SelectChangeEvent<string>
	) => void;
	handleSubmit: (e: React.FormEvent) => Promise<void>;
	filters: QuickNoteFilters;
	setFilters: React.Dispatch<React.SetStateAction<QuickNoteFilters>>;
}

const QuickNoteLayout: React.FC<QuickNoteLayoutProps> = ({
	quickNotes,
	isLoading,
	pagination,
	setPagination,
	handleEditQuickNote,
	handleDeleteQuickNote,
	handleSelectQuickNote,
	handleCancel,
	initialQuickNoteData,
	selectedQuickNote,
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
								{initialQuickNoteData
									? "Edit Quick Note"
									: "Add New Quick Note"}
							</Typography>
							<AddQuickNoteForm
								initialData={initialQuickNoteData}
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
							<QuickNoteDetail quickNote={selectedQuickNote} />
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
							<QuickNoteHistory
								quickNotes={quickNotes}
								initialPagination={pagination}
								handleEdit={handleEditQuickNote}
								handleDelete={handleDeleteQuickNote}
								handleSelectQuickNote={handleSelectQuickNote}
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

export default QuickNoteLayout;
