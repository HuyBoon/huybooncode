import React from "react";
import {
	Button,
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Box,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { MoodType } from "@/types/interface";

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

interface AddJournalFormProps {
	moods: MoodType[];
	initialData?: FormData;
	onSubmit: (e: React.FormEvent) => Promise<void>;
	onCancel?: () => void;
	formData: FormData;
	formErrors: FormErrors;
	handleChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| SelectChangeEvent<string>
	) => void;
}

const AddJournalForm: React.FC<AddJournalFormProps> = ({
	moods,
	initialData,
	onSubmit,
	onCancel,
	formData,
	formErrors,
	handleChange,
}) => {
	return (
		<Box component="form" onSubmit={onSubmit} sx={{ p: 2 }}>
			<TextField
				fullWidth
				label="Title"
				name="title"
				value={formData.title}
				onChange={handleChange}
				error={!!formErrors.title}
				helperText={formErrors.title}
				margin="normal"
			/>
			<TextField
				fullWidth
				label="Content"
				name="content"
				value={formData.content}
				onChange={handleChange}
				error={!!formErrors.content}
				helperText={formErrors.content}
				margin="normal"
				multiline
				rows={4}
			/>
			<FormControl fullWidth margin="normal" error={!!formErrors.mood}>
				<InputLabel>Mood</InputLabel>
				<Select
					name="mood"
					value={formData.mood}
					onChange={handleChange}
					label="Mood"
				>
					{moods.map((mood) => (
						<MenuItem key={mood.id} value={mood.name}>
							{mood.emoji} {mood.name}
						</MenuItem>
					))}
				</Select>
				{formErrors.mood && (
					<p className="text-red-500 text-sm">{formErrors.mood}</p>
				)}
			</FormControl>
			<TextField
				fullWidth
				label="Date"
				name="date"
				type="datetime-local"
				value={formData.date}
				onChange={handleChange}
				error={!!formErrors.date}
				helperText={formErrors.date}
				margin="normal"
				InputLabelProps={{ shrink: true }}
			/>
			<Box sx={{ mt: 2, display: "flex", gap: 2 }}>
				<Button type="submit" variant="contained" color="primary">
					{formData.id && !formData.id.startsWith("temp-") ? "Update" : "Add"}{" "}
					Journal
				</Button>
				<Button variant="outlined" color="secondary" onClick={onCancel}>
					Cancel
				</Button>
			</Box>
		</Box>
	);
};

export default AddJournalForm;
