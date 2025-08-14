
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
    useMediaQuery,
    useTheme,
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Card
            sx={{
                background: "transparent",
                color: "#fff",
                boxShadow: "none",
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                    variant="h6"
                    sx={{
                        display: isMobile ? "none" : "block",
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    }}
                >
                    {formData.id ? "Edit Task" : "Add Task"}
                </Typography>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={isMobile ? 2.5 : 2}>
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
                                size={isMobile ? "small" : "medium"}
                                InputLabelProps={{ sx: { color: "#fff" } }}
                                sx={{
                                    "& .MuiInputBase-root": { fontSize: "1rem" },
                                    "& .MuiInputBase-input": { color: "#fff", fontSize: "1rem" },
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                }}
                                aria-label="Enter task title"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl
                                fullWidth
                                error={!!formErrors.status}
                                size={isMobile ? "small" : "medium"}
                                sx={{ "& .MuiInputBase-root": { fontSize: "1rem" } }}
                            >
                                <InputLabel sx={{ color: "#fff" }}>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={(e) => handleChange({ target: { name: "status", value: e.target.value } })}
                                    label="Status"
                                    disabled={loading || statuses.length === 0}
                                    sx={{
                                        color: "#fff",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                        "& .MuiSvgIcon-root": { color: "#fff" },
                                    }}
                                    aria-label="Select task status"
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
                                    <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{ mt: 0.5, fontSize: "0.875rem" }}
                                    >
                                        {formErrors.status}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl
                                fullWidth
                                error={!!formErrors.priority}
                                size={isMobile ? "small" : "medium"}
                                sx={{ "& .MuiInputBase-root": { fontSize: "1rem" } }}
                            >
                                <InputLabel sx={{ color: "#fff" }}>Priority</InputLabel>
                                <Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={(e) => handleChange({ target: { name: "priority", value: e.target.value } })}
                                    label="Priority"
                                    disabled={loading}
                                    sx={{
                                        color: "#fff",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                        "& .MuiSvgIcon-root": { color: "#fff" },
                                    }}
                                    aria-label="Select task priority"
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                                {formErrors.priority && (
                                    <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{ mt: 0.5, fontSize: "0.875rem" }}
                                    >
                                        {formErrors.priority}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl
                                fullWidth
                                error={!!formErrors.category}
                                size={isMobile ? "small" : "medium"}
                                sx={{ "& .MuiInputBase-root": { fontSize: "1rem" } }}
                            >
                                <InputLabel sx={{ color: "#fff" }}>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => handleChange({ target: { name: "category", value: e.target.value } })}
                                    label="Category"
                                    disabled={loading || categories.length === 0}
                                    sx={{
                                        color: "#fff",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                        "& .MuiSvgIcon-root": { color: "#fff" },
                                    }}
                                    aria-label="Select task category"
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
                                    <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{ mt: 0.5, fontSize: "0.875rem" }}
                                    >
                                        {formErrors.category}
                                    </Typography>
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
                                InputLabelProps={{ shrink: true, sx: { color: "#fff" } }}
                                error={!!formErrors.dueDate}
                                helperText={formErrors.dueDate}
                                size={isMobile ? "small" : "medium"}
                                sx={{
                                    "& .MuiInputBase-root": { fontSize: "1rem" },
                                    "& .MuiInputBase-input": { color: "#fff", fontSize: "1rem" },
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                }}
                                aria-label="Select task due date and time"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography sx={{ color: "#fff" }}>Enable Notifications</Typography>
                                    <Switch
                                        name="notifyEnabled"
                                        checked={formData.notifyEnabled}
                                        onChange={(e) =>
                                            handleChange({
                                                target: { name: "notifyEnabled", value: e.target.checked },
                                            })
                                        }
                                        disabled={loading}
                                        sx={{ "& .MuiSwitch-switchBase": { color: "#fff" } }}
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
                                size={isMobile ? "small" : "medium"}
                                InputLabelProps={{ sx: { color: "#fff" } }}
                                sx={{
                                    "& .MuiInputBase-root": { fontSize: "1rem" },
                                    "& .MuiInputBase-input": { color: "#fff", fontSize: "1rem" },
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                }}
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
                                rows={isMobile ? 2 : 3}
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                size={isMobile ? "small" : "medium"}
                                InputLabelProps={{ sx: { color: "#fff" } }}
                                sx={{
                                    "& .MuiInputBase-root": { fontSize: "1rem" },
                                    "& .MuiInputBase-input": { color: "#fff", fontSize: "1rem" },
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                                }}
                                aria-label="Enter task description"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Stack
                                direction="row"
                                spacing={isMobile ? 1 : 2}
                                justifyContent="flex-end"
                            >
                                {formData.id && (
                                    <Button
                                        variant="outlined"
                                        onClick={onCancel}
                                        disabled={loading}
                                        sx={{
                                            minWidth: { xs: 80, sm: 100 },
                                            fontSize: "0.875rem",
                                            py: isMobile ? 1 : 1.5,
                                            color: "#fff",
                                            borderColor: "#fff",
                                            "&:hover": {
                                                borderColor: "#fff",
                                                backgroundColor: "rgba(255,255,255,0.1)",
                                            },
                                        }}
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
                                            <CircularProgress size={isMobile ? 16 : 20} />
                                        ) : (
                                            <CheckCircle size={isMobile ? 16 : 20} />
                                        )
                                    }
                                    sx={{
                                        minWidth: { xs: 80, sm: 100 },
                                        fontSize: "0.875rem",
                                        py: isMobile ? 1 : 1.5,
                                        backgroundColor: "#1976d2",
                                        "&:hover": { backgroundColor: "#115293" },
                                    }}
                                    aria-label={formData.id ? "Update task" : "Add task"}
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

