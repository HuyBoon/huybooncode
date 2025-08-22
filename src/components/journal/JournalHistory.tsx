"use client";

import React, { forwardRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  TablePagination,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  SelectChangeEvent,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit, Delete, RefreshCw, Eye } from "lucide-react";
import { JournalType, MoodType, PaginationType } from "@/types/interface";
import sanitizeHtml from "sanitize-html";
import { useJournalFilter } from "@/hooks/journal/useJournalFilter";

interface JournalFilters {
  date?: string;
  mood: string;
  period: string;
}

interface JournalHistoryProps {
  journals: JournalType[];
  moods: MoodType[];
  initialPagination: PaginationType;
  handleEdit: (journal: JournalType) => void;
  handleDelete: (id: string) => void;
  handleSelectJournal: (journal: JournalType) => void;
  loading: boolean;
  pagination: PaginationType;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
}

const JournalHistory = forwardRef<
  { journals: JournalType[]; filters: JournalFilters },
  JournalHistoryProps
>(
  (
    { journals, moods, initialPagination, handleEdit, handleDelete, handleSelectJournal, loading, pagination, setPagination },
    ref
  ) => {
    const { filters, setFilters, resetFilters, handleFilterChange } = useJournalFilter(moods, initialPagination);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    React.useImperativeHandle(ref, () => ({
      journals,
      filters,
    }));

    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
    ) => {
      setPagination((prev) => ({ ...prev, page: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setPagination((prev) => ({
        ...prev,
        limit: parseInt(event.target.value, 10),
        page: 1,
      }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
      const { name, value } = e.target;
      if (name) {
        handleFilterChange(name as keyof JournalFilters, value);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name) {
        handleFilterChange(name as keyof JournalFilters, value);
      }
    };

    return (
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "white" }}>
          Journal History
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: "white" }}>Mood</InputLabel>
              <Select
                name="mood"
                value={filters.mood}
                onChange={handleSelectChange}
                label="Mood"
                disabled={loading}
                sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" } }}
              >
                <MenuItem value="all">All</MenuItem>
                {moods.map((mood) => (
                  <MenuItem key={mood.id} value={mood.name}>
                    {mood.emoji} {mood.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: "white" }}>Period</InputLabel>
              <Select
                name="period"
                value={filters.period}
                onChange={handleSelectChange}
                label="Period"
                disabled={loading}
                sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" } }}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Date (YYYY-MM)"
                name="date"
                value={filters.date || ""}
                onChange={handleInputChange}
                disabled={loading}
                type="month"
                InputLabelProps={{ shrink: true, style: { color: "white" } }}
                variant="outlined"
                sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.3)" } }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button
              variant="outlined"
              onClick={resetFilters}
              startIcon={<RefreshCw size={16} />}
              sx={{ mt: 1, color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
              disabled={loading}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
        <Table sx={{ background: "transparent" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Title</TableCell>
              {!isMobile && <TableCell sx={{ color: "white" }}>Content</TableCell>}
              {!isMobile && <TableCell sx={{ color: "white" }}>Mood</TableCell>}
              {!isMobile && <TableCell sx={{ color: "white" }}>Date</TableCell>}
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {journals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 2 : 5} align="center">
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    No journals found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              journals.map((journal) => (
                <TableRow key={journal.id}>
                  <TableCell sx={{ color: "white" }}>{journal.title}</TableCell>
                  {!isMobile && (
                    <TableCell sx={{ color: "white" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(journal.content, {
                            allowedTags: ["p", "b", "i", "u", "ul", "ol", "li", "a"],
                            allowedAttributes: { a: ["href"] },
                          }),
                        }}
                      />
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell sx={{ color: "white" }}>
                      {moods.find((m) => m.name === journal.mood)?.emoji} {journal.mood}
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell sx={{ color: "white" }}>
                      {new Date(journal.date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton
                      onClick={() => handleSelectJournal(journal)}
                      disabled={loading}
                      aria-label={`View ${journal.title}`}
                    >
                      <Eye size={16} color="white" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEdit(journal)}
                      disabled={loading}
                      aria-label={`Edit ${journal.title}`}
                    >
                      <Edit size={16} color="white" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(journal.id)}
                      disabled={loading}
                      aria-label={`Delete ${journal.title}`}
                    >
                      <Delete size={16} color="red" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: "white",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              color: "white",
            },
            "& .MuiTablePagination-select": {
              color: "white",
            },
            "& .MuiTablePagination-actions button": {
              color: "white",
            },
          }}
        />
      </Box>
    );
  }
);

export default JournalHistory;