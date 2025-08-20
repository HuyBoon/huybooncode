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
      <Box sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Journal History
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Mood</InputLabel>
              <Select
                name="mood"
                value={filters.mood}
                onChange={handleSelectChange}
                label="Mood"
                disabled={loading}
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
              <InputLabel>Period</InputLabel>
              <Select
                name="period"
                value={filters.period}
                onChange={handleSelectChange}
                label="Period"
                disabled={loading}
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
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button
              variant="outlined"
              onClick={resetFilters}
              startIcon={<RefreshCw size={16} />}
              sx={{ mt: 1 }}
              disabled={loading}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Mood</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {journals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No journals found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              journals.map((journal) => (
                <TableRow key={journal.id}>
                  <TableCell>{journal.title}</TableCell>
                  <TableCell>
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
                  <TableCell>
                    {moods.find((m) => m.name === journal.mood)?.emoji} {journal.mood}
                  </TableCell>
                  <TableCell>
                    {new Date(journal.date).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleSelectJournal(journal)}
                      disabled={loading}
                      aria-label={`View ${journal.title}`}
                    >
                      <Eye size={16} color="blue" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEdit(journal)}
                      disabled={loading}
                      aria-label={`Edit ${journal.title}`}
                    >
                      <Edit size={16} />
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
        />
      </Box>
    );
  }
);

export default JournalHistory;