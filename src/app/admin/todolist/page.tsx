"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from "@mui/material";
import { CheckCircle, Settings } from "lucide-react";
import { TodoType, StatusType, CategoryType } from "@/types/interface";
import Loader from "@/components/admin/Loader";
import TodoSummary from "@/components/admin/TodoSummary";
import TodoHistory from "@/components/admin/TodoHistory";

// Explicit interface for formData to enforce strict typing
interface FormData {
  id: string | null;
  title: string;
  description: string;
  status: string;
  priority: "low" | "medium" | "high";
  category: string;
  dueDate: string;
}

const TodoPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [formData, setFormData] = useState<FormData>({
    id: null,
    title: "",
    description: "",
    status: "",
    priority: "medium",
    category: "",
    dueDate: new Date().toISOString().split("T")[0],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    dueDate: new Date().toISOString().split("T")[0].slice(0, 7), // YYYY-MM
    status: "all",
    priority: "all",
    category: "all",
  });
  const todoHistoryRef = useRef<{ todos: TodoType[] }>({ todos: [] });

  // Fetch statuses, categories, and todos
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch("/api/statuses");
        if (response.ok) {
          const data: StatusType[] = await response.json();
          console.log("Statuses fetched:", data); // Debug
          setStatuses(data);
          if (data.length > 0 && !formData.status) {
            setFormData((prev) => ({ ...prev, status: data[0].id }));
          }
          // Check if "Completed" status exists
          if (!data.some((s) => s.name.toLowerCase() === "completed")) {
            setSnackbar({
              open: true,
              message: "No 'Completed' status found. Please add it in Settings.",
              severity: "warning",
            });
          }
        } else {
          setSnackbar({
            open: true,
            message: "Failed to fetch statuses",
            severity: "error",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error fetching statuses",
          severity: "error",
        });
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data: CategoryType[] = await response.json();
          console.log("Categories fetched:", data); // Debug
          setCategories(data);
          if (data.length > 0 && !formData.category) {
            setFormData((prev) => ({ ...prev, category: data[0].id }));
          }
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

    const fetchTodos = async () => {
      try {
        const { page, limit } = pagination;
        const { dueDate, status, priority, category } = filters;
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          dueDate,
          ...(status !== "all" && { status }),
          ...(priority !== "all" && { priority }),
          ...(category !== "all" && { category }),
        });
        const response = await fetch(`/api/todos?${params}`);
        if (response.ok) {
          const { data, pagination: newPagination } = await response.json();
          console.log("Todos fetched:", data); // Debug
          setTodos(data);
          setPagination((prev) => ({ ...prev, ...newPagination }));
        } else {
          setSnackbar({
            open: true,
            message: "Failed to fetch todos",
            severity: "error",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error fetching todos",
          severity: "error",
        });
      }
    };

    fetchStatuses().then(() => fetchCategories().then(() => fetchTodos()));
  }, [
    pagination.page,
    pagination.limit,
    filters,
    formData.status,
    formData.category,
  ]);

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.status ||
      !formData.priority ||
      !formData.category ||
      !formData.dueDate
    ) {
      setSnackbar({
        open: true,
        message: "Title, status, priority, category, and due date are required",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    const body = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate,
    };
    console.log("Submitting todo:", body); // Debug

    try {
      const url = isEditing ? `/api/todos` : "/api/todos";
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { id: formData.id, ...body } : body),
      });
      if (response.ok) {
        const updatedTodo: TodoType = await response.json();
        setTodos((prev) =>
          isEditing
            ? prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
            : [...prev, updatedTodo]
        );
        setSnackbar({
          open: true,
          message: isEditing ? "Todo updated!" : "Todo added!",
          severity: "success",
        });
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error saving todo:", errorData); // Debug
        setSnackbar({
          open: true,
          message: errorData.error || "Failed to save todo",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error saving todo:", error); // Debug
      setSnackbar({
        open: true,
        message: "Error saving todo",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (todo: TodoType) => {
    console.log("Editing todo:", todo); // Debug
    setFormData({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority as "low" | "medium" | "high",
      category: todo.category,
      dueDate: todo.dueDate,
    });
    setIsEditing(true);
  };

  // Handle complete
  const handleComplete = async (id: string, isCompleted: boolean) => {
    const completedStatus = statuses.find(
      (s) => s.name.toLowerCase() === "completed"
    );
    if (!completedStatus) {
      setSnackbar({
        open: true,
        message: "No 'Completed' status found. Please add it in Settings.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Marking todo as completed:", { id, status: completedStatus.id }); // Debug
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: completedStatus.id,
          title: todos.find((t) => t.id === id)?.title,
          description: todos.find((t) => t.id === id)?.description,
          priority: todos.find((t) => t.id === id)?.priority,
          category: todos.find((t) => t.id === id)?.category,
          dueDate: todos.find((t) => t.id === id)?.dueDate,
        }),
      });
      if (response.ok) {
        const updatedTodo: TodoType = await response.json();
        setTodos((prev) =>
          prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
        );
        setSnackbar({
          open: true,
          message: "Todo marked as completed!",
          severity: "success",
        });
      } else {
        const errorData = await response.json();
        console.error("Error marking todo as completed:", errorData); // Debug
        setSnackbar({
          open: true,
          message: errorData.error || "Failed to mark todo as completed",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error marking todo as completed:", error); // Debug
      setSnackbar({
        open: true,
        message: "Error marking todo as completed",
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
      console.log("Deleting todo with id:", id); // Debug
      const response = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
          totalPages: Math.ceil((prev.total - 1) / prev.limit),
        }));
        setSnackbar({
          open: true,
          message: "Todo deleted!",
          severity: "success",
        });
      } else {
        const errorData = await response.json();
        console.error("Error deleting todo:", errorData); // Debug
        setSnackbar({
          open: true,
          message: errorData.error || "Failed to delete todo",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting todo:", error); // Debug
      setSnackbar({
        open: true,
        message: "Error deleting todo",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      description: "",
      status: statuses.length > 0 ? statuses[0].id : "",
      priority: "medium",
      category: categories.length > 0 ? categories[0].id : "",
      dueDate: new Date().toISOString().split("T")[0],
    });
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", py: 6, px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          Manage Todos
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/admin/todolist/categories")}
          startIcon={<Settings size={20} />}
          sx={{ textTransform: "none", fontWeight: 500 }}
          aria-label="Manage categories"
        >
          Manage Categories
        </Button>
      </Box>

      {/* Summary */}
      <TodoSummary todos={todos} />

      {/* Form */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {isEditing ? "Edit Todo" : "Add Todo"}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={loading}
                aria-label="Enter title"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  label="Status"
                  disabled={loading || statuses.length === 0}
                  aria-label="Select status"
                >
                  {statuses.length === 0 ? (
                    <MenuItem value="" disabled>
                      No statuses available
                    </MenuItem>
                  ) : (
                    statuses.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.icon} {status.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as "low" | "medium" | "high",
                    })
                  }
                  label="Priority"
                  disabled={loading}
                  aria-label="Select priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  label="Category"
                  disabled={loading || categories.length === 0}
                  aria-label="Select category"
                >
                  {categories.length === 0 ? (
                    <MenuItem value="" disabled>
                      No categories available
                    </MenuItem>
                  ) : (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                aria-label="Select due date"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={loading}
                multiline
                rows={4}
                aria-label="Enter description"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
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
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <CheckCircle size={20} />
                    )
                  }
                  sx={{ textTransform: "none", fontWeight: 500 }}
                  aria-label={isEditing ? "Update todo" : "Add todo"}
                >
                  {loading ? "Saving..." : isEditing ? "Update" : "Add"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Todo History */}
      <TodoHistory
        todos={todos}
        statuses={statuses}
        categories={categories}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleComplete={handleComplete}
        pagination={pagination}
        setPagination={setPagination}
        setFilters={setFilters}
        ref={todoHistoryRef}
      />

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
    </Box>
  );
};

export default TodoPage;