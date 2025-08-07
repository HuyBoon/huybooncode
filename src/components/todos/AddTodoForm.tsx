"use client";

import React from "react";
import {
    Card,
    CardContent,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Stack,
    Typography,
    CircularProgress,
    Switch,
} from "@mui/material";
import { CheckCircle } from "lucide-react";
import { TodoType, StatusType, CategoryType } from "@/types/interface";
import { ChangeEvent } from "react";

interface AddTodoFormProps {
    categories: CategoryType[];
    statuses: StatusType[];
    loading: boolean;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onCancel: () => void;
    initialData?: {
        id: string | null;
        title: string;
        description: string;
        status: string;
        priority: "low" | "medium" | "high";
        category: string;
        dueDate: string;
        notifyEnabled: boolean;
        notifyMinutesBefore: number;
    };
    formData: {
        id: string | null;
        title: string;
        description: string;
        status: string;
        priority: "low" | "medium" | "high";
        category: string;
        dueDate: string;
        notifyEnabled: boolean;
        notifyMinutesBefore: number;
    };
    formErrors: {
        title?: string;
        status?: string;
        priority?: string;
        category?: string;
        dueDate?: string;
        description?: string;
        notifyMinutesBefore?: string;
    };
    handleChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown } }
    ) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({
    categories,
    statuses,
    loading,
    onSubmit,
    onCancel,
    formData,
    formErrors,
    handleChange,
}) => {
    return (
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {formData.id ? "Edit Todo" : "Add Todo"}
                </Typography>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                disabled={loading}
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                                aria-label="Enter title"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth error={!!formErrors.status}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={(e) => handleChange({ target: { name: "status", value: e.target.value } })}
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
                                            <MenuItem key={status.id} value={status.name}>
                                                {status.icon} {status.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                {formErrors.status && (
                                    <Typography color="error">{formErrors.status}</Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth error={!!formErrors.priority}>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={(e) => handleChange({ target: { name: "priority", value: e.target.value } })}
                                    label="Priority"
                                    disabled={loading}
                                    aria-label="Select priority"
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                                {formErrors.priority && (
                                    <Typography color="error">{formErrors.priority}</Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth error={!!formErrors.category}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => handleChange({ target: { name: "category", value: e.target.value } })}
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
                                {formErrors.category && (
                                    <Typography color="error">{formErrors.category}</Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Due Date"
                                type="datetime-local"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                error={!!formErrors.dueDate}
                                helperText={formErrors.dueDate}
                                aria-label="Select due date and time"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography>Enable Notifications</Typography>
                                    <Switch
                                        name="notifyEnabled"
                                        checked={formData.notifyEnabled}
                                        onChange={(e) =>
                                            handleChange({
                                                target: { name: "notifyEnabled", value: e.target.checked },
                                            })
                                        }
                                        disabled={loading}
                                        aria-label="Toggle notifications"
                                    />
                                </Stack>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Notify Minutes Before"
                                type="number"
                                name="notifyMinutesBefore"
                                value={formData.notifyMinutesBefore}
                                onChange={handleChange}
                                disabled={loading || !formData.notifyEnabled}
                                error={!!formErrors.notifyMinutesBefore}
                                helperText={formErrors.notifyMinutesBefore}
                                aria-label="Set notification time"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={loading}
                                multiline
                                rows={4}
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                aria-label="Enter description"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                {formData.id && (
                                    <Button
                                        variant="outlined"
                                        onClick={onCancel}
                                        disabled={loading}
                                        sx={{ textTransform: "none", fontWeight: 500 }}
                                        aria-label="Cancel editing"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={loading}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : (
                                            <CheckCircle size={20} />
                                        )
                                    }
                                    sx={{ textTransform: "none", fontWeight: 500 }}
                                    aria-label={formData.id ? "Update todo" : "Add todo"}
                                >
                                    {loading ? "Saving..." : formData.id ? "Update" : "Add"}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddTodoForm;