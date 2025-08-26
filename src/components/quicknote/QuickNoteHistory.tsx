import React, { forwardRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Eye, RefreshCw } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { QuickNoteType, PaginationType, QuickNoteFilters } from "@/types/interface";
import { fetchQuickNotes } from "@/utils/apiQuickNote";
import sanitizeHtml from "sanitize-html";

interface QuickNoteHistoryProps {
  quickNotes: QuickNoteType[];
  initialPagination: PaginationType;
  handleEdit: (quickNote: QuickNoteType) => void;
  handleDelete: (id: string) => void;
  handleSelectQuickNote: (quickNote: QuickNoteType) => void;
  loading: boolean;
  pagination: PaginationType;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
  filters: QuickNoteFilters;
  setFilters: React.Dispatch<React.SetStateAction<QuickNoteFilters>>;
}

const QuickNoteHistory = forwardRef<
  { quickNotes: QuickNoteType[]; filters: QuickNoteFilters },
  QuickNoteHistoryProps
>(
  (
    {
      quickNotes: initialQuickNotes,
      initialPagination,
      handleEdit,
      handleDelete,
      handleSelectQuickNote,
      loading,
      pagination,
      setPagination,
      filters,
      setFilters,
    },
    ref
  ) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { ref: inViewRef, inView } = useInView();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
      useInfiniteQuery({
        queryKey: ["quickNotes", filters],
        queryFn: async ({ pageParam = 1 }) => {
          const response = await fetchQuickNotes({
            page: pageParam,
            limit: pagination.limit,
            period: filters.period !== "all" ? filters.period : undefined,
            date: filters.date,
            category: filters.category !== "all" ? filters.category : undefined,
          });
          return response;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
          return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
        },
        initialData: {
          pages: [{ data: initialQuickNotes, pagination: initialPagination }],
          pageParams: [1],
        },
      });

    const notes = data?.pages.flatMap((page) => page.data) || [];

    React.useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    React.useEffect(() => {
      const lastPage = data?.pages[data.pages.length - 1];
      if (lastPage) {
        setPagination((prev) => ({
          ...prev,
          total: lastPage.pagination.total,
          totalPages: lastPage.pagination.totalPages,
        }));
      }
    }, [data, setPagination]);

    React.useImperativeHandle(ref, () => ({
      quickNotes: notes,
      filters,
    }));

    const handleSelectChange = (e: import("@mui/material").SelectChangeEvent<string>) => {
      const { name, value } = e.target;
      if (name) {
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name) {
        setFilters((prev) => ({ ...prev, [name]: value || "" }));
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    };

    return (
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600, color: "white" }}
        >
          Quick Note History
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: "white" }}>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleSelectChange}
                label="Category"
                disabled={loading || isLoading}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                {["Work", "Personal", "Ideas", "To-Do"].map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
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
                disabled={loading || isLoading}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
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
                disabled={loading || isLoading}
                type="month"
                InputLabelProps={{ shrink: true, style: { color: "white" } }}
                variant="outlined"
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFilters({ date: "", period: "all", category: "all" });
                setPagination({ ...initialPagination, page: 1 });
              }}
              startIcon={<RefreshCw size={16} />}
              sx={{
                mt: 1,
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
              disabled={loading || isLoading}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
        <Box
          sx={{
            maxHeight: 400,
            overflow: "auto",
            bgcolor: "transparent",
          }}
        >
          <Table sx={{ background: "transparent" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Content</TableCell>
                {!isMobile && <TableCell sx={{ color: "white" }}>Category</TableCell>}
                {!isMobile && <TableCell sx={{ color: "white" }}>Date</TableCell>}
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 2 : 4} align="center">
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      No notes found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notes.map((note) => (
                  <TableRow key={note.id}>
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
                          __html: sanitizeHtml(note.content, {
                            allowedTags: ["p", "b", "i", "u", "ul", "ol", "li", "a"],
                            allowedAttributes: { a: ["href"] },
                          }),
                        }}
                      />
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ color: "white" }}>{note.category}</TableCell>
                    )}
                    {!isMobile && (
                      <TableCell sx={{ color: "white" }}>
                        {new Date(note.date).toLocaleString("en-US", {
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
                        onClick={() => handleSelectQuickNote(note)}
                        disabled={loading || isLoading}
                        aria-label={`View ${note.content}`}
                      >
                        <Eye size={16} color="white" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEdit(note)}
                        disabled={loading || isLoading}
                        aria-label={`Edit ${note.content}`}
                      >
                        <Edit size={16} color="white" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(note.id)}
                        disabled={loading || isLoading}
                        aria-label={`Delete ${note.content}`}
                      >
                        <Delete size={16} color="red" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {isLoading && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {hasNextPage && !isFetchingNextPage && (
            <Box sx={{ textAlign: "center", py: 2 }} ref={inViewRef}>
              <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Scroll to load more...
              </Typography>
            </Box>
          )}
          {isFetchingNextPage && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {!hasNextPage && notes.length > 0 && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                No more notes to load
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);

export default QuickNoteHistory;