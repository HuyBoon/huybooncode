"use client";

import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { JournalType } from "@/types/interface";
import sanitizeHtml from "sanitize-html";

interface JournalDetailProps {
	journal: JournalType | null;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ journal }) => {
	if (!journal) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
					No Journal Selected
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Select a journal to view details
				</Typography>
			</Box>
		);
	}

	return (
		<Card elevation={0}>
			<CardContent sx={{ p: 3 }}>
				<Typography variant="h5" gutterBottom sx={{ fontWeight: "medium" }}>
					{journal.title}
				</Typography>
				<Typography
					variant="body1"
					paragraph
					dangerouslySetInnerHTML={{
						__html: sanitizeHtml(journal.content, {
							allowedTags: ["p", "b", "i", "u", "ul", "ol", "li", "a"],
							allowedAttributes: { a: ["href"] },
						}),
					}}
				/>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					Mood: {journal.mood}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					Date: {new Date(journal.date).toLocaleDateString()}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					Created At: {new Date(journal.createdAt).toLocaleDateString()}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Updated At: {new Date(journal.updatedAt).toLocaleDateString()}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default JournalDetail;
