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
import { BlogCategoryType, BlogType } from "@/types/interface";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => void;
}

const AddBlogForm: React.FC<AddBlogFormProps> = ({
  categories,
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
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        {formErrors.blogcategory && (
          <Typography
            sx={{
              color: "#ffb3b3",
              fontSize: "0.75rem",
              mt: 0.5,
            }}
          >
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
          {["draft", "published", "archived"].map((status) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </MenuItem>
          ))}
        </Select>
        {formErrors.status && (
          <Typography
            sx={{
              color: "#ffb3b3",
              fontSize: "0.75rem",
              mt: 0.5,
            }}
          >
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
      <TextField
        fullWidth
        label="Thumbnail URL"
        name="thumbnail"
        value={formData.thumbnail}
        onChange={handleChange}
        error={!!formErrors.thumbnail}
        helperText={formErrors.thumbnail}
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
          {formData.id && !formData.id.startsWith("temp-") ? "Update" : "Add"} Blog
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