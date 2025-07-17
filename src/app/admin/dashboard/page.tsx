"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
	Stack,
	Typography,
	Card,
	CardContent,
	Box,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Chip,
	Button,
	Grid,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import {
	CheckSquare,
	DollarSign,
	NotebookPen,
	Calendar,
	FileText,
	Clock,
	TrendingUp,
	TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";
import Loader from "@/components/admin/Loader";

// Component cho Overview Section
const OverviewSection = ({ stats }: { stats: any[] }) => (
	<Grid container spacing={3}>
		{stats.map((stat, index) => (
			<Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
				<Card sx={{ boxShadow: 3, bgcolor: "background.paper" }}>
					<CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Box
							sx={{ color: stat.color, display: "flex", alignItems: "center" }}
						>
							{stat.icon}
						</Box>
						<Box>
							<Typography variant="h6" sx={{ fontWeight: "medium" }}>
								{stat.value}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{stat.title}
							</Typography>
						</Box>
					</CardContent>
				</Card>
			</Grid>
		))}
	</Grid>
);

// Component cho Finance Section
const FinanceSection = ({ chartData }: { chartData: any }) => (
	<Card sx={{ boxShadow: 3, bgcolor: "background.paper", mt: 4 }}>
		<CardContent>
			<Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
				Finance Overview
			</Typography>
			<BarChart
				xAxis={[{ scaleType: "band", data: chartData.months }]}
				series={[
					{ data: chartData.income, label: "Income", color: "#4caf50" },
					{ data: chartData.expense, label: "Expense", color: "#ef5350" },
					{ data: chartData.plans, label: "Plans", color: "#0288d1" },
				]}
				height={300}
			/>
		</CardContent>
	</Card>
);

// Component cho TodoList Section
const TodoListSection = ({ todos }: { todos: any[] }) => (
	<Card sx={{ boxShadow: 3, bgcolor: "background.paper", mt: 4 }}>
		<CardContent>
			<Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
				To-Do List (Today)
			</Typography>
			<Divider sx={{ mb: 2 }} />
			<Table sx={{ minWidth: { xs: "auto", md: 650 } }}>
				<TableHead>
					<TableRow>
						<TableCell>Task</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Due Date</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{todos.map((todo) => (
						<TableRow key={todo.id}>
							<TableCell>{todo.description}</TableCell>
							<TableCell>
								<Chip
									label={todo.status}
									color={todo.status === "Completed" ? "success" : "warning"}
									size="small"
								/>
							</TableCell>
							<TableCell>{todo.dueDate}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</CardContent>
	</Card>
);

// Component cho Calendar Section
const CalendarSection = ({ events }: { events: any[] }) => (
	<Card sx={{ boxShadow: 3, bgcolor: "background.paper", mt: 4 }}>
		<CardContent>
			<Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
				Upcoming Events
			</Typography>
			<Divider sx={{ mb: 2 }} />
			<Stack spacing={1}>
				{events.map((event) => (
					<Box
						key={event.id}
						sx={{ display: "flex", alignItems: "center", gap: 2 }}
					>
						<Calendar size={20} color="#0288d1" />
						<Typography variant="body2">{event.title}</Typography>
						<Typography variant="body2" color="text.secondary">
							{event.date}
						</Typography>
					</Box>
				))}
			</Stack>
		</CardContent>
	</Card>
);

// Component cho Journal Section
const JournalSection = ({ journals }: { journals: any[] }) => (
	<Card sx={{ boxShadow: 3, bgcolor: "background.paper", mt: 4 }}>
		<CardContent>
			<Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
				Recent Journals
			</Typography>
			<Divider sx={{ mb: 2 }} />
			<Stack spacing={1}>
				{journals.map((journal) => (
					<Box
						key={journal.id}
						sx={{ display: "flex", alignItems: "center", gap: 2 }}
					>
						<NotebookPen size={20} color="#0288d1" />
						<Typography variant="body2">{journal.title}</Typography>
						<Typography variant="body2" color="text.secondary">
							{journal.date}
						</Typography>
					</Box>
				))}
			</Stack>
		</CardContent>
	</Card>
);

// Component cho Blog Section
const BlogSection = ({ blogs }: { blogs: any[] }) => (
	<Card sx={{ boxShadow: 3, bgcolor: "background.paper", mt: 4 }}>
		<CardContent>
			<Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
				Recent Blogs
			</Typography>
			<Divider sx={{ mb: 2 }} />
			<Stack spacing={1}>
				{blogs.map((blog) => (
					<Box
						key={blog.id}
						sx={{ display: "flex", alignItems: "center", gap: 2 }}
					>
						<FileText size={20} color="#0288d1" />
						<Typography variant="body2">{blog.title}</Typography>
						<Typography variant="body2" color="text.secondary">
							{blog.date}
						</Typography>
					</Box>
				))}
			</Stack>
		</CardContent>
	</Card>
);

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [data, setData] = useState({
		stats: [
			{
				title: "Total Tasks",
				value: "42",
				icon: <CheckSquare size={24} />,
				color: "primary.main",
			},
			{
				title: "Total Income",
				value: "$5,230",
				icon: <DollarSign size={24} />,
				color: "success.main",
			},
			{
				title: "Recent Journals",
				value: "8",
				icon: <NotebookPen size={24} />,
				color: "info.main",
			},
			{
				title: "Blog Posts",
				value: "12",
				icon: <FileText size={24} />,
				color: "warning.main",
			},
		],
		chartData: {
			months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
			income: [1200, 1900, 3000, 2500, 4000, 3200],
			expense: [800, 1400, 2000, 1800, 2200, 1900],
			plans: [500, 600, 800, 700, 900, 850],
		},
		todos: [
			{
				id: 1,
				description: "Complete project proposal",
				status: "Completed",
				dueDate: "2025-07-17",
			},
			{
				id: 2,
				description: "Review finance report",
				status: "Pending",
				dueDate: "2025-07-18",
			},
		],
		events: [
			{ id: 1, title: "Team meeting", date: "2025-07-18" },
			{ id: 2, title: "Project deadline", date: "2025-07-20" },
		],
		journals: [
			{ id: 1, title: "Daily reflection", date: "2025-07-15" },
			{ id: 2, title: "Project ideas", date: "2025-07-14" },
		],
		blogs: [
			{ id: 1, title: "How to manage tasks effectively", date: "2025-07-13" },
			{ id: 2, title: "Finance tips for coders", date: "2025-07-12" },
		],
	});

	// Giả lập gọi API để lấy dữ liệu
	useEffect(() => {
		const fetchData = async () => {
			// Thay bằng API thực tế, ví dụ:
			// const response = await fetch("/api/dashboard");
			// const apiData = await response.json();
			// setData(apiData);
		};
		fetchData();
	}, []);

	if (status === "loading") {
		return <Loader />;
	}

	if (status === "unauthenticated") {
		router.push("/login");
		return null;
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Stack spacing={3} sx={{ maxWidth: "lg", mx: "auto", py: 4 }}>
				{/* Header */}
				<Typography
					variant="h4"
					sx={{ fontWeight: "bold", color: "text.primary", textAlign: "left" }}
				>
					Bonjour, {session?.user?.name || "HuyBoon"}!
				</Typography>

				{/* Overview Section */}
				<OverviewSection stats={data.stats} />

				{/* Finance Section */}
				<FinanceSection chartData={data.chartData} />

				{/* TodoList Section */}
				<TodoListSection todos={data.todos} />

				{/* Calendar Section */}
				<CalendarSection events={data.events} />

				{/* Journal Section */}
				<JournalSection journals={data.journals} />

				{/* Blog Section */}
				<BlogSection blogs={data.blogs} />

				{/* Action Button */}
				<Box sx={{ mt: 4, textAlign: "right" }}>
					<Button
						variant="contained"
						color="primary"
						onClick={() => router.push("/admin/todolist")}
						startIcon={<CheckSquare size={20} />}
					>
						Manage Tasks
					</Button>
				</Box>
			</Stack>
		</motion.div>
	);
}
