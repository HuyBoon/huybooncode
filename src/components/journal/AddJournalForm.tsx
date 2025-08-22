"use client";

import React from "react";
import {
	Button,
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Box,
	Typography,
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
		<Box
			component="form"
			onSubmit={onSubmit}
			sx={{
				px: 3,
				pb: 3,
				color: "white",
				background: "transparent",
				boxShadow: "none",
			}}
		>
			<TextField
				fullWidth
				label="Title"
				name="title"
				value={formData.title}
				onChange={handleChange}
				error={!!formErrors.title}
				helperText={formErrors.title}
				margin="normal"
				InputLabelProps={{ style: { color: "white" } }}
				InputProps={{ style: { color: "white" } }}
				sx={{
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "rgba(255, 255, 255, 0.3)",
					},
					"& .MuiFormHelperText-root": { color: "rgba(255, 255, 255, 0.7)" },
				}}
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
				InputLabelProps={{ style: { color: "white" } }}
				InputProps={{ style: { color: "white" } }}
				sx={{
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "rgba(255, 255, 255, 0.3)",
					},
					"& .MuiFormHelperText-root": { color: "rgba(255, 255, 255, 0.7)" },
				}}
			/>
			<FormControl fullWidth margin="normal" error={!!formErrors.mood}>
				<InputLabel sx={{ color: "white" }}>Mood</InputLabel>
				<Select
					name="mood"
					value={formData.mood}
					onChange={handleChange}
					label="Mood"
					MenuProps={{
						PaperProps: {
							sx: {
								backgroundColor: "#2e004f", // tím đậm
								color: "white",
								"& .MuiMenuItem-root": {
									backgroundColor: "#2e004f", // xóa padding trắng
									"&:hover": {
										backgroundColor: "#5a189a", // hover tím sáng
									},
									"&.Mui-selected": {
										backgroundColor: "#7b2cbf !important", // màu rõ ràng khi chọn
										color: "white",
									},
								},
								"& .MuiList-root": {
									padding: 0, // bỏ khoảng trắng trên/dưới
								},
							},
						},
					}}
					sx={{
						color: "white",
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: "rgba(255, 255, 255, 0.5)",
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "#bb86fc",
						},
						"& .MuiSvgIcon-root": {
							color: "white",
						},
					}}
				>
					{moods.map((mood) => (
						<MenuItem key={mood.id} value={mood.name}>
							{mood.emoji} {mood.name}
						</MenuItem>
					))}
				</Select>

				{formErrors.mood && (
					<Typography
						sx={{
							color: "#ffb3b3", // đỏ nhạt dễ đọc trên nền tím
							fontSize: "0.75rem",
							mt: 0.5,
						}}
					>
						{formErrors.mood}
					</Typography>
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
				InputLabelProps={{ shrink: true, style: { color: "white" } }}
				InputProps={{ style: { color: "white" } }}
				sx={{
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "rgba(255, 255, 255, 0.3)",
					},
					"& .MuiFormHelperText-root": { color: "rgba(255, 255, 255, 0.7)" },
				}}
			/>
			<Box sx={{ mt: 2, display: "flex", gap: 2 }}>
				<Button
					type="submit"
					variant="contained"
					sx={{
						backgroundColor: "#3d2352",
						color: "white",
						"&:hover": { backgroundColor: "#4b2e6a" },
					}}
				>
					{formData.id && !formData.id.startsWith("temp-") ? "Update" : "Add"}{" "}
					Journal
				</Button>
				{onCancel && (
					<Button
						variant="outlined"
						onClick={onCancel}
						sx={{
							color: "white",
							borderColor: "rgba(255, 255, 255, 0.3)",
							"&:hover": { borderColor: "white" },
						}}
					>
						Cancel
					</Button>
				)}
			</Box>
		</Box>
	);
};

export default AddJournalForm;
