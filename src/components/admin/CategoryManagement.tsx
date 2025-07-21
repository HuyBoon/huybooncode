"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import { CategoryType } from "@/types/interface";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [formData, setFormData] = useState({ id: null as string | null, name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          setSnackbar({
            open: true,
            message: "Failed to fetch categories",
            severity: "error",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error fetching categories",
          severity: "error",
        });
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name || !formData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Category name is required",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const url = isEditing ? `/api/categories/${formData.id}` : "/api/categories";
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name.trim() }),
      });
      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories((prev) =>
          isEditing
            ? prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
            : [...prev, updatedCategory]
        );
        setSnackbar({
          open: true,
          message: isEditing ? "Category updated!" : "Category added!",
          severity: "success",
        });
        resetForm();
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.error || "Failed to save category",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error saving category",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        setSnackbar({
          open: true,
          message: "Category deleted!",
          severity: "success",
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.error || "Failed to delete category",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting category",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (category: CategoryType) => {
    setFormData({ id: category.id, name: category.name });
    setIsEditing(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ id: null, name: "" });
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Manage Todo Categories
        </Typography>

        {/* Form */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            aria-label="Enter category name"
          />
          <Stack direction="row" spacing={1}>
            {isEditing && (
              <Button
                variant="outlined"
                onClick={resetForm}
                disabled={loading}
                sx={{ textTransform: "none", fontWeight: 500 }}
                aria-label="Cancel editing"
              >
                Cancel
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ textTransform: "none", fontWeight: 500 }}
              aria-label={isEditing ? "Update category" : "Add category"}
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Add"}
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEdit(category)}
                    disabled={loading}
                    aria-label={`Edit category ${category.id}`}
                  >
                    <Edit size={20} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(category.id)}
                    disabled={loading}
                    aria-label={`Delete category ${category.id}`}
                  >
                    <Trash2 size={20} color="red" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;