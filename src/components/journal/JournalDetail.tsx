import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { JournalType } from "@/types/interface";

interface JournalDetailProps {
	journal: JournalType | null;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ journal }) => {
	if (!journal) {
		return (
			<Box sx={{ p: 2 }}>
				<Typography variant="h6">No Journal Selected</Typography>
				<Typography>Select a journal to view details</Typography>
			</Box>
		);
	}

	return (
		<Card>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					{journal.title}
				</Typography>
				<Typography variant="body1" paragraph>
					{journal.content}
				</Typography>
				<Typography variant="body2">Mood: {journal.mood}</Typography>
				<Typography variant="body2">
					Date: {new Date(journal.date).toLocaleString()}
				</Typography>
				<Typography variant="body2">
					Created At: {new Date(journal.createdAt).toLocaleString()}
				</Typography>
				<Typography variant="body2">
					Updated At: {new Date(journal.updatedAt).toLocaleString()}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default JournalDetail;
