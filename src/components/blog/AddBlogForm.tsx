import React, { useState, useEffect } from "react";
import {
	Button,
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Box,
	Typography,
	Avatar,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { BlogCategoryType, BlogType } from "@/types/interface";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import sanitizeHtml from "sanitize-html";
import { Upload } from "lucide-react";

interface FormData {
	id?: string;
	title: string;
	slug: string;
	description: string;
	introductions: string;
	content: string;
	blogcategory: string;
	status: string;
	tags: string;
	thumbnail: string;
	thumbnailFile?: File | null;
}

interface FormErrors {
	title?: string;
	slug?: string;
	description?: string;
	introductions?: string;
	content?: string;
	blogcategory?: string;
	status?: string;
	tags?: string;
	thumbnail?: string;
}

interface AddBlogFormProps {
	categories: BlogCategoryType[];
	initialData?: BlogType;
	onSubmit: (e: React.FormEvent) => Promise<void>;
	onCancel?: () => void;
	formData: FormData;
	formErrors: FormErrors;
	handleChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| SelectChangeEvent<string>
			| { target: { name: string; value: any } }
	) => void;
}

const AddBlogForm = ({
	categories,
	initialData,
	onSubmit,
	onCancel,
	formData,
	formErrors,
	handleChange,
}: AddBlogFormProps) => {
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
		formData.thumbnail || null
	);
	const [isClient, setIsClient] = useState(false);

	// Ensure editor is only initialized on client side
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Tiptap editor setup
	const editor = useEditor({
		extensions: [
			StarterKit, // Basic formatting (bold, italic, headings, lists, etc.)
			Image.configure({
				inline: true,
				allowBase64: false,
			}),
		],
		content: formData.content || "<p>Start typing...</p>",
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			const sanitizedContent = sanitizeHtml(html, {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				allowedAttributes: {
					...sanitizeHtml.defaults.allowedAttributes,
					img: ["src", "alt"],
				},
			});
			handleChange({ target: { name: "content", value: sanitizedContent } });
		},
		editable: true,
		immediatelyRender: false, // Fix for SSR hydration mismatch
	});

	// Handle image upload for both thumbnail and content
	const handleImageUpload = async (
		file: File,
		isContentImage: boolean = false
	): Promise<string> => {
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (!["image/jpeg", "image/png"].includes(file.type)) {
			throw new Error("Only JPEG or PNG images are allowed");
		}
		if (file.size > maxSize) {
			throw new Error("Image size must be less than 5MB");
		}

		const formData = new FormData();
		formData.append("image", file);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
			{
				method: "POST",
				body: formData,
			}
		);
		if (!response.ok) {
			throw new Error("Failed to upload image");
		}
		const { url } = await response.json();
		return url;
	};

	// Handle thumbnail file input
	const handleThumbnailChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				const url = await handleImageUpload(file);
				setThumbnailPreview(url);
				handleChange({ target: { name: "thumbnail", value: url } });
			} catch (error: any) {
				alert(error.message || "Failed to upload thumbnail");
			}
		}
	};

	// Handle image upload for Tiptap editor
	const handleAddImageToContent = async () => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/jpeg,image/png");
		input.click();
		input.onchange = async () => {
			const file = input.files?.[0];
			if (file && editor) {
				try {
					const url = await handleImageUpload(file, true);
					editor.chain().focus().setImage({ src: url }).run();
				} catch (error: any) {
					alert(error.message || "Failed to upload image to content");
				}
			}
		};
	};

	// Custom toolbar for Tiptap
	const Toolbar = () => (
		<Box sx={{ mb: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
			<Button
				variant="outlined"
				size="small"
				onClick={() => editor?.chain().focus().toggleBold().run()}
				sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
			>
				Bold
			</Button>
			<Button
				variant="outlined"
				size="small"
				onClick={() => editor?.chain().focus().toggleItalic().run()}
				sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
			>
				Italic
			</Button>
			<Button
				variant="outlined"
				size="small"
				onClick={() =>
					editor?.chain().focus().toggleHeading({ level: 1 }).run()
				}
				sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
			>
				H1
			</Button>
			<Button
				variant="outlined"
				size="small"
				onClick={() =>
					editor?.chain().focus().toggleHeading({ level: 2 }).run()
				}
				sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
			>
				H2
			</Button>
			<Button
				variant="outlined"
				size="small"
				onClick={() => editor?.chain().focus().toggleBulletList().run()}
				sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
			>
				Bullet List
			</Button>
			<Button
				variant="outlined"
				size="small"
				onClick={handleAddImageToContent}
				sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
			>
				Image
			</Button>
			<Button
				variant="outlined"
				size="small"
				onClick={() => editor?.chain().focus().setParagraph().run()}
				sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
			>
				Clear Format
			</Button>
		</Box>
	);

	// Render nothing or a fallback during SSR
	if (!isClient) {
		return (
			<Box
				sx={{
					px: 3,
					pb: 3,
					color: "white",
					background: "transparent",
					boxShadow: "none",
				}}
			>
				<Typography>Loading editor...</Typography>
			</Box>
		);
	}

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
				label="Slug"
				name="slug"
				value={formData.slug}
				onChange={handleChange}
				error={!!formErrors.slug}
				helperText={formErrors.slug}
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
				label="Description"
				name="description"
				value={formData.description}
				onChange={handleChange}
				error={!!formErrors.description}
				helperText={formErrors.description}
				margin="normal"
				multiline
				rows={2}
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
				label="Introductions"
				name="introductions"
				value={formData.introductions}
				onChange={handleChange}
				error={!!formErrors.introductions}
				helperText={formErrors.introductions}
				margin="normal"
				multiline
				rows={2}
				InputLabelProps={{ style: { color: "white" } }}
				InputProps={{ style: { color: "white" } }}
				sx={{
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "rgba(255, 255, 255, 0.3)",
					},
					"& .MuiFormHelperText-root": { color: "rgba(255, 255, 255, 0.7)" },
				}}
			/>
			<Box sx={{ mt: 2, mb: 1 }}>
				<Typography sx={{ color: "white", mb: 1 }}>Content</Typography>
				<Toolbar />
				<EditorContent
					editor={editor}
					style={{
						backgroundColor: "white",
						color: "black",
						borderRadius: "4px",
						padding: "8px",
						minHeight: "200px",
						border: "1px solid rgba(255, 255, 255, 0.3)",
					}}
				/>
				{formErrors.content && (
					<Typography sx={{ color: "#ffb3b3", fontSize: "0.75rem", mt: 0.5 }}>
						{formErrors.content}
					</Typography>
				)}
			</Box>
			<FormControl fullWidth margin="normal" error={!!formErrors.blogcategory}>
				<InputLabel sx={{ color: "white" }}>Category</InputLabel>
				<Select
					name="blogcategory"
					value={formData.blogcategory}
					onChange={handleChange}
					label="Category"
					MenuProps={{
						PaperProps: {
							sx: {
								backgroundColor: "#2e004f",
								color: "white",
								"& .MuiMenuItem-root": {
									backgroundColor: "#2e004f",
									"&:hover": { backgroundColor: "#5a189a" },
									"&.Mui-selected": {
										backgroundColor: "#7b2cbf !important",
										color: "white",
									},
								},
								"& .MuiList-root": { padding: 0 },
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
						"& .MuiSvgIcon-root": { color: "white" },
					}}
				>
					{categories.map((category) => (
						<MenuItem key={category.id} value={category.id}>
							{category.name}
						</MenuItem>
					))}
				</Select>
				{formErrors.blogcategory && (
					<Typography sx={{ color: "#ffb3b3", fontSize: "0.75rem", mt: 0.5 }}>
						{formErrors.blogcategory}
					</Typography>
				)}
			</FormControl>
			<FormControl fullWidth margin="normal" error={!!formErrors.status}>
				<InputLabel sx={{ color: "white" }}>Status</InputLabel>
				<Select
					name="status"
					value={formData.status}
					onChange={handleChange}
					label="Status"
					MenuProps={{
						PaperProps: {
							sx: {
								backgroundColor: "#2e004f",
								color: "white",
								"& .MuiMenuItem-root": {
									backgroundColor: "#2e004f",
									"&:hover": { backgroundColor: "#5a189a" },
									"&.Mui-selected": {
										backgroundColor: "#7b2cbf !important",
										color: "white",
									},
								},
								"& .MuiList-root": { padding: 0 },
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
						"& .MuiSvgIcon-root": { color: "white" },
					}}
				>
					{["draft", "published", "archived"].map((status) => (
						<MenuItem key={status} value={status}>
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</MenuItem>
					))}
				</Select>
				{formErrors.status && (
					<Typography sx={{ color: "#ffb3b3", fontSize: "0.75rem", mt: 0.5 }}>
						{formErrors.status}
					</Typography>
				)}
			</FormControl>
			<TextField
				fullWidth
				label="Tags (comma-separated)"
				name="tags"
				value={formData.tags}
				onChange={handleChange}
				error={!!formErrors.tags}
				helperText={formErrors.tags}
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
			<Box sx={{ mt: 2 }}>
				<Typography sx={{ color: "white", mb: 1 }}>Thumbnail</Typography>
				<Button
					variant="outlined"
					component="label"
					startIcon={<Upload size={16} />}
					sx={{
						color: "white",
						borderColor: "rgba(255, 255, 255, 0.3)",
						"&:hover": { borderColor: "white" },
					}}
				>
					Upload Thumbnail
					<input
						type="file"
						accept="image/jpeg,image/png"
						hidden
						onChange={handleThumbnailChange}
					/>
				</Button>
				{thumbnailPreview && (
					<Box sx={{ mt: 1 }}>
						<Avatar
							src={thumbnailPreview}
							alt="Thumbnail Preview"
							sx={{ width: 100, height: 100, borderRadius: "8px" }}
						/>
					</Box>
				)}
				{formErrors.thumbnail && (
					<Typography sx={{ color: "#ffb3b3", fontSize: "0.75rem", mt: 0.5 }}>
						{formErrors.thumbnail}
					</Typography>
				)}
			</Box>
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
					Blog
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

export default AddBlogForm;
