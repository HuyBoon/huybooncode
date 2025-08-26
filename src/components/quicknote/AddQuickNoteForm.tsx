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
import { QuickNoteType } from "@/types/interface";

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

interface AddQuickNoteFormProps {
	initialData?: QuickNoteType;
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

const AddQuickNoteForm: React.FC<AddQuickNoteFormProps> = ({
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
			<TextField
				fullWidth
				label="Date"
				name="date"
				type="date"
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
			<FormControl fullWidth margin="normal" error={!!formErrors.category}>
				<InputLabel sx={{ color: "white" }}>Category</InputLabel>
				<Select
					name="category"
					value={formData.category}
					onChange={handleChange}
					label="Category"
					MenuProps={{
						PaperProps: {
							sx: {
								backgroundColor: "#2e004f",
								color: "white",
								"& .MuiMenuItem-root": {
									backgroundColor: "#2e004f",
									"&:hover": {
										backgroundColor: "#5a189a",
									},
									"&.Mui-selected": {
										backgroundColor: "#7b2cbf !important",
										color: "white",
									},
								},
								"& .MuiList-root": {
									padding: 0,
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
					{["Work", "Personal", "Ideas", "To-Do"].map((category) => (
						<MenuItem key={category} value={category}>
							{category}
						</MenuItem>
					))}
				</Select>
				{formErrors.category && (
					<Typography
						sx={{
							color: "#ffb3b3",
							fontSize: "0.75rem",
							mt: 0.5,
						}}
					>
						{formErrors.category}
					</Typography>
				)}
			</FormControl>
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
					Note
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

export default AddQuickNoteForm;
