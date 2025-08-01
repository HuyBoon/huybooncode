"use client";
import React from "react";
import {
    Card,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Stack,
    Autocomplete,
    CircularProgress,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Bitcoin } from "lucide-react";
import { FinanceCategoryType, FinanceEntryType } from "@/types/interface";
import { useTransactionForm } from "@/hooks/useTransactionForm";

interface AddTransactionFormProps {
    categories: FinanceCategoryType[];
    loading: boolean;
    onSubmit: (data: {
        id: string | null;
        type: FinanceEntryType;
        amount: number;
        category: string;
        description?: string;
        date: string;
    }) => Promise<void>;
    onCancel?: () => void;
    initialData?: {
        id: string | null;
        type: FinanceEntryType;
        amount: string;
        category: string;
        description: string;
        date: string;
    };
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
    categories,
    loading,
    onSubmit,
    onCancel,
    initialData,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {
        formData,
        errors,
        handleChange,
        handleCategoryChange,
        handleTypeChange,
        handleSubmit,
    } = useTransactionForm({ categories, initialData, onSubmit });

    return (
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    }}
                >
                    {formData.id ? "Edit Transaction" : "Add Transaction"}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={isMobile ? 1.5 : 2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl
                                fullWidth
                                error={!!errors.type}
                                size={isMobile ? "small" : "medium"}
                                sx={{ "& .MuiInputBase-root": { fontSize: { xs: "0.875rem", sm: "1rem" } } }}
                            >
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                    labelId="type-label"
                                    name="type"
                                    value={formData.type}
                                    onChange={(e) =>
                                        handleTypeChange(e.target.value as FinanceEntryType)
                                    }
                                    label="Type"
                                    disabled={loading}
                                    aria-label="Select transaction type"
                                >
                                    <MenuItem value="income">Income</MenuItem>
                                    <MenuItem value="expense">Expense</MenuItem>
                                    <MenuItem value="saving">Saving</MenuItem>
                                    <MenuItem value="investment">Investment</MenuItem>
                                    <MenuItem value="debt">Debt</MenuItem>
                                    <MenuItem value="loan">Loan</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                {errors.type && (
                                    <Typography
                                        color="error"
                                        variant="caption"
                                        sx={{ mt: 0.5, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                                    >
                                        {errors.type}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Autocomplete
                                options={categories.filter(
                                    (cat) =>
                                        cat.type &&
                                        typeof cat.type === "string" &&
                                        cat.type.toLowerCase() === formData.type.toLowerCase()
                                )}
                                getOptionLabel={(option) => option.name}
                                value={categories.find((cat) => cat.id === formData.category) || null}
                                onChange={(e, newValue) => handleCategoryChange(newValue?.id || "")}
                                disabled={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Category"
                                        error={!!errors.category}
                                        helperText={errors.category}
                                        size={isMobile ? "small" : "medium"}
                                        sx={{ "& .MuiInputBase-root": { fontSize: { xs: "0.875rem", sm: "1rem" } } }}
                                        aria-label="Select transaction category"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="amount"
                                label="Amount (VND)"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                fullWidth
                                disabled={loading}
                                error={!!errors.amount}
                                helperText={errors.amount}
                                size={isMobile ? "small" : "medium"}
                                sx={{ "& .MuiInputBase-root": { fontSize: { xs: "0.875rem", sm: "1rem" } } }}
                                aria-label="Enter transaction amount"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                name="date"
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                fullWidth
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.date}
                                helperText={errors.date}
                                size={isMobile ? "small" : "medium"}
                                sx={{ "& .MuiInputBase-root": { fontSize: { xs: "0.875rem", sm: "1rem" } } }}
                                aria-label="Select transaction date"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                name="description"
                                label="Description (Optional)"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={isMobile ? 2 : 3}
                                disabled={loading}
                                error={!!errors.description}
                                helperText={errors.description}
                                size={isMobile ? "small" : "medium"}
                                sx={{ "& .MuiInputBase-root": { fontSize: { xs: "0.875rem", sm: "1rem" } } }}
                                aria-label="Enter transaction description"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={isMobile ? 1 : 2} justifyContent="flex-end">
                                {onCancel && (
                                    <Button
                                        variant="outlined"
                                        onClick={onCancel}
                                        disabled={loading}
                                        sx={{
                                            minWidth: { xs: 80, sm: 100 },
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                            py: isMobile ? 1 : 1.5,
                                        }}
                                        aria-label="Cancel form"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress size={isMobile ? 16 : 20} />
                                        ) : (
                                            <Bitcoin size={isMobile ? 16 : 20} />
                                        )
                                    }
                                    sx={{
                                        minWidth: { xs: 80, sm: 100 },
                                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                        py: isMobile ? 1 : 1.5,
                                    }}
                                    aria-label={formData.id ? "Update transaction" : "Add transaction"}
                                >
                                    {formData.id ? "Update" : "Add"}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddTransactionForm;