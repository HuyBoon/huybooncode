"use client";

import { useState } from "react";
import {
	Typography,
	TextField,
	Button,
	Card,
	CardContent,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import dayjs from "dayjs";

interface JournalEntry {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
}

export default function JournalPage() {
	const [entries, setEntries] = useState<JournalEntry[]>([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const handleAddEntry = () => {
		if (title && content) {
			setEntries([
				...entries,
				{
					id: `ENTRY-${Date.now()}`,
					title,
					content,
					createdAt: new Date(),
				},
			]);
			setTitle("");
			setContent("");
		}
	};

	return (
		<div>
			<Typography variant="h4" gutterBottom>
				Journal
			</Typography>
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<TextField
						label="Entry Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Entry Content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						fullWidth
						multiline
						rows={4}
						margin="normal"
					/>
					<Button variant="contained" onClick={handleAddEntry} sx={{ mt: 2 }}>
						Add Entry
					</Button>
				</CardContent>
			</Card>
			<List>
				{entries.map((entry) => (
					<ListItem key={entry.id}>
						<ListItemText
							primary={entry.title}
							secondary={`${entry.content} — ${dayjs(entry.createdAt).format(
								"MMM D, YYYY h:mm A"
							)}`}
						/>
					</ListItem>
				))}
			</List>
		</div>
	);
}
