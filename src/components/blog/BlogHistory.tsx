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
import { format, toZonedTime } from "date-fns-tz";

import {
	BlogType,
	BlogCategoryType,
	PaginationType,
	BlogFilters,
} from "@/types/interface";
import { fetchBlogs } from "@/services/blogs/apiBlog";
import sanitizeHtml from "sanitize-html";

interface BlogHistoryProps {
	blogs: BlogType[];
	categories: BlogCategoryType[];
	initialPagination: PaginationType;
	handleEdit: (blog: BlogType) => void;
	handleDelete: (id: string) => void;
	handleSelectBlog: (blog: BlogType) => void;
	loading: boolean;
	pagination: PaginationType;
	setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
	filters: BlogFilters;
	setFilters: React.Dispatch<React.SetStateAction<BlogFilters>>;
}

const BlogHistory = forwardRef<
	{ blogs: BlogType[]; filters: BlogFilters },
	BlogHistoryProps
>(
	(
		{
			blogs: initialBlogs,
			categories,
			initialPagination,
			handleEdit,
			handleDelete,
			handleSelectBlog,
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
				queryKey: ["blogs", filters],
				queryFn: async ({ pageParam = 1 }) => {
					const response = await fetchBlogs({
						page: pageParam,
						limit: pagination.limit,
						status: filters.status !== "all" ? filters.status : undefined,
						category: filters.category !== "all" ? filters.category : undefined,
						date: filters.date,
						period: filters.period !== "all" ? filters.period : undefined,
					});
					return response;
				},
				initialPageParam: 1,
				getNextPageParam: (lastPage, allPages) => {
					const nextPage = allPages.length + 1;
					return nextPage <= lastPage.pagination.totalPages
						? nextPage
						: undefined;
				},
				initialData: {
					pages: [{ data: initialBlogs, pagination: initialPagination }],
					pageParams: [1],
				},
			});

		const blogs = data?.pages.flatMap((page) => page.data) || [];

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
			blogs,
			filters,
		}));

		const handleSelectChange = (
			e: import("@mui/material").SelectChangeEvent<string>
		) => {
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

		const timeZone = "Asia/Ho_Chi_Minh";

		return (
			<Box sx={{ p: 3, flexGrow: 1 }}>
				<Typography
					variant="h6"
					sx={{ mb: 2, fontWeight: 600, color: "white" }}
				>
					Blog History
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
								{categories.map((category) => (
									<MenuItem key={category.id} value={category.id}>
										{category.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 12, sm: 3 }}>
						<FormControl fullWidth variant="outlined">
							<InputLabel sx={{ color: "white" }}>Status</InputLabel>
							<Select
								name="status"
								value={filters.status}
								onChange={handleSelectChange}
								label="Status"
								disabled={loading || isLoading}
								sx={{
									color: "white",
									"& .MuiOutlinedInput-notchedOutline": {
										borderColor: "rgba(255, 255, 255, 0.3)",
									},
								}}
							>
								<MenuItem value="all">All</MenuItem>
								{["draft", "published", "archived"].map((status) => (
									<MenuItem key={status} value={status}>
										{status.charAt(0).toUpperCase() + status.slice(1)}
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
								setFilters({
									date: "",
									status: "all",
									category: "all",
									period: "all",
								});
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
								<TableCell sx={{ color: "white" }}>Title</TableCell>
								{!isMobile && (
									<TableCell sx={{ color: "white" }}>Category</TableCell>
								)}
								{!isMobile && (
									<TableCell sx={{ color: "white" }}>Status</TableCell>
								)}
								{!isMobile && (
									<TableCell sx={{ color: "white" }}>Date</TableCell>
								)}
								<TableCell sx={{ color: "white" }}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{blogs.length === 0 && !isLoading ? (
								<TableRow>
									<TableCell colSpan={isMobile ? 2 : 5} align="center">
										<Typography
											variant="body2"
											sx={{ color: "rgba(255, 255, 255, 0.7)" }}
										>
											No blogs found
										</Typography>
									</TableCell>
								</TableRow>
							) : (
								blogs.map((blog) => (
									<TableRow key={blog.id}>
										<TableCell sx={{ color: "white" }}>
											<Typography
												variant="body2"
												sx={{
													display: "-webkit-box",
													WebkitLineClamp: 2,
													WebkitBoxOrient: "vertical",
													overflow: "hidden",
												}}
											>
												{blog.title}
											</Typography>
										</TableCell>
										{!isMobile && (
											<TableCell sx={{ color: "white" }}>
												{categories.find((c) => c.id === blog.blogcategory)
													?.name || "N/A"}
											</TableCell>
										)}
										{!isMobile && (
											<TableCell sx={{ color: "white" }}>
												{blog.status.charAt(0).toUpperCase() +
													blog.status.slice(1)}
											</TableCell>
										)}
										{!isMobile && (
											<TableCell sx={{ color: "white" }}>
												{format(
													toZonedTime(new Date(blog.createdAt), timeZone),
													"dd/MM/yyyy HH:mm",
													{ timeZone }
												)}
											</TableCell>
										)}
										<TableCell>
											<IconButton
												onClick={() => handleSelectBlog(blog)}
												disabled={loading || isLoading}
												aria-label={`View ${blog.title}`}
											>
												<Eye size={16} color="white" />
											</IconButton>
											<IconButton
												onClick={() => handleEdit(blog)}
												disabled={loading || isLoading}
												aria-label={`Edit ${blog.title}`}
											>
												<Edit size={16} color="white" />
											</IconButton>
											<IconButton
												onClick={() => handleDelete(blog.id)}
												disabled={loading || isLoading}
												aria-label={`Delete ${blog.title}`}
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
					{!hasNextPage && blogs.length > 0 && (
						<Box sx={{ textAlign: "center", py: 2 }}>
							<Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
								No more blogs to load
							</Typography>
						</Box>
					)}
				</Box>
			</Box>
		);
	}
);

export default BlogHistory;
