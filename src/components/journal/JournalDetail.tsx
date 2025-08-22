"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";
import { JournalType } from "@/types/interface";
import sanitizeHtml from "sanitize-html";

interface JournalDetailProps {
	journal: JournalType | null;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ journal }) => {
	if (!journal) {
		return (
			<Box sx={{ p: 3, color: "white" }}>
				<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
					No Journal Selected
				</Typography>
				<Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
					Select a journal to view details
				</Typography>
			</Box>
		);
	}

	return (
		<Card
			elevation={0}
			sx={{
				background: "transparent",
				color: "white",
				borderRadius: "16px",
				p: 3,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<CardContent sx={{ px: 3, flexGrow: 1 }}>
				<Typography
					variant="h4"
					gutterBottom
					sx={{
						fontWeight: "bold",
						color: "white",
						textAlign: "center",
						mb: 2,
						fontSize: "1.3rem",
						letterSpacing: "1px",
					}}
				>
					{journal.title}
				</Typography>
				<Divider sx={{ borderColor: "rgba(255, 255, 255, 0.3)", mb: 2 }} />
				<Box
					sx={{
						background: "rgba(255, 255, 255, 0.05)",
						borderRadius: "8px",
						p: 2,
						mb: 3,
						"& p": {
							color: "white",
							fontSize: "1.1rem",
							lineHeight: 1.6,
							margin: 0,
						},
					}}
					dangerouslySetInnerHTML={{
						__html: sanitizeHtml(journal.content, {
							allowedTags: ["p", "b", "i", "u", "ul", "ol", "li", "a"],
							allowedAttributes: { a: ["href"] },
						}),
					}}
				/>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Mood: {journal.mood}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Date:{" "}
						{new Date(journal.date).toLocaleString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Created:{" "}
						{new Date(journal.createdAt).toLocaleString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Updated:{" "}
						{new Date(journal.updatedAt).toLocaleString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

export default JournalDetail;
