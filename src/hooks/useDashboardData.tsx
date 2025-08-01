import { useState, useEffect } from "react";
import {
	CheckSquare,
	CheckCircle,
	TrendingUp,
	TrendingDown,
} from "lucide-react";
import {
	TodoType,
	StatusType,
	FinanceType,
	JournalType,
	EventType,
	BlogType,
} from "@/types/interface";
import moment from "moment";

interface DashboardData {
	stats: Array<{
		title: string;
		value: string | number;
		icon: React.ReactNode;
		color: string;
	}>;
	chartData: {
		months: string[];
		income: number[];
		expense: number[];
		plans: number[];
	};
	todos: TodoType[];
	events: EventType[];
	journals: JournalType[];
	blogs: BlogType[];
}

type Severity = "success" | "error" | "warning";

interface SnackbarState {
	open: boolean;
	message: string;
	severity: Severity;
}

export default function useDashboardData() {
	const [data, setData] = useState<DashboardData>({
		stats: [],
		chartData: { months: [], income: [], expense: [], plans: [] },
		todos: [],
		events: [],
		journals: [],
		blogs: [],
	});
	const [statuses, setStatuses] = useState<StatusType[]>([]);
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState<SnackbarState>({
		open: false,
		message: "",
		severity: "success",
	});

	// Fetch statuses
	const fetchStatuses = async (): Promise<StatusType[]> => {
		const response = await fetch("/api/statuses");
		if (!response.ok)
			throw new Error(`Failed to fetch statuses: ${response.statusText}`);
		const statusData: StatusType[] = await response.json();
		if (!statusData.some((s) => s.name.toLowerCase() === "completed")) {
			setSnackbar({
				open: true,
				message: "No 'Completed' status found. Please add it in Settings.",
				severity: "warning",
			});
		}
		return statusData;
	};

	// Fetch todos for today
	const fetchTodos = async (): Promise<TodoType[]> => {
		const today = new Date().toISOString().split("T")[0];
		const params = new URLSearchParams({ dueDate: today, limit: "5" });
		const response = await fetch(`/api/todos?${params}`);
		if (!response.ok)
			throw new Error(`Failed to fetch todos: ${response.statusText}`);
		const { data: todos }: { data: TodoType[] } = await response.json();
		return todos;
	};

	// Fetch finances for the last 6 months
	const fetchFinances = async (): Promise<FinanceType[]> => {
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
		const params = new URLSearchParams({
			year: sixMonthsAgo.getFullYear().toString(),
			month: (sixMonthsAgo.getMonth() + 1).toString(),
		});
		const response = await fetch(`/api/finances?${params}`);
		if (!response.ok)
			throw new Error(`Failed to fetch finances: ${response.statusText}`);
		const { data: finances }: { data: FinanceType[] } = await response.json();
		return finances;
	};

	// Fetch journals (limit to 5)
	const fetchJournals = async (): Promise<JournalType[]> => {
		const params = new URLSearchParams({ limit: "5" });
		const response = await fetch(`/api/journals?${params}`);
		if (response.ok) {
			const { data }: { data: JournalType[] } = await response.json();
			return data;
		}
		console.warn("Journals API failed, using static data");
		return [
			{
				id: "1",
				title: "Daily reflection",
				content: "Reflected on daily tasks",
				mood: "neutral",
				date: "2025-07-20",
				createdAt: "2025-07-20T00:00:00.000Z",
				updatedAt: "2025-07-20T00:00:00.000Z",
			},
			{
				id: "2",
				title: "Project ideas",
				content: "Brainstormed new project concepts",
				mood: "positive",
				date: "2025-07-19",
				createdAt: "2025-07-19T00:00:00.000Z",
				updatedAt: "2025-07-19T00:00:00.000Z",
			},
		];
	};

	// Fetch events for the current month
	const fetchEvents = async (): Promise<EventType[]> => {
		const start = moment().startOf("month").toISOString();
		const end = moment().endOf("month").toISOString();
		const params = new URLSearchParams({ start, end });
		const response = await fetch(`/api/events?${params}`);
		if (response.ok) {
			const { data }: { data: EventType[] } = await response.json();
			return data;
		}
		console.warn("Events API failed, using static data");
		return [
			{
				id: "1",
				title: "Team meeting",
				description: "Weekly sync",
				start: "2025-07-22T10:00:00.000Z",
				end: "2025-07-22T11:00:00.000Z",
				createdAt: "2025-07-22T00:00:00.000Z",
				updatedAt: "2025-07-22T00:00:00.000Z",
			},
			{
				id: "2",
				title: "Project deadline",
				description: "Final submission",
				start: "2025-07-25T00:00:00.000Z",
				end: "2025-07-25T23:59:59.999Z",
				createdAt: "2025-07-22T00:00:00.000Z",
				updatedAt: "2025-07-22T00:00:00.000Z",
			},
		];
	};

	// Fetch recent blogs (limit to 5)
	const fetchBlogs = async (): Promise<BlogType[]> => {
		const params = new URLSearchParams({ limit: "5" });
		const response = await fetch(`/api/blogs?${params}`);
		if (response.ok) {
			const { data }: { data: BlogType[] } = await response.json();
			return data;
		}
		console.warn("Blogs API failed, using static data");
		return [
			{
				id: "1",
				title: "Sample Blog",
				slug: "sample-blog",
				description: "A sample blog post",
				introductions: "Introduction to the sample blog",
				blogcategory: "66a4b3c2d4f5e6a7890b2c1f",
				thumbnail: "https://example.com/thumbnail.jpg",
				content: "<p>This is a sample blog content</p>",
				status: "published",
				tags: ["sample", "test"],
				views: 10,
				createdAt: "2025-07-22T00:00:00.000Z",
				updatedAt: "2025-07-22T00:00:00.000Z",
			},
		];
	};

	// Calculate finance chart data
	const calculateChartData = (
		finances: FinanceType[]
	): DashboardData["chartData"] => {
		const months: string[] = [];
		const income: number[] = [];
		const expense: number[] = [];
		const plans: number[] = [];
		const now = new Date();
		for (let i = 5; i >= 0; i--) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthName = date.toLocaleString("default", { month: "short" });
			months.push(monthName);
			const monthFinances = finances.filter(
				(f) =>
					new Date(f.date).getFullYear() === date.getFullYear() &&
					new Date(f.date).getMonth() === date.getMonth()
			);
			income.push(
				monthFinances
					.filter((f) => f.type === "income")
					.reduce((sum, f) => sum + f.amount, 0)
			);
			expense.push(
				monthFinances
					.filter((f) => f.type === "expense")
					.reduce((sum, f) => sum + f.amount, 0)
			);
			plans.push(0); // Mocked: No budget field in FinanceType; replace with actual data if available
		}
		return { months, income, expense, plans };
	};

	// Calculate stats
	const calculateStats = (
		todos: TodoType[],
		finances: FinanceType[],
		statuses: StatusType[]
	): DashboardData["stats"] => {
		const totalTasks = todos.length;
		const completedTasks = todos.filter((t) =>
			statuses.some(
				(s) => s.id === t.status && s.name.toLowerCase() === "completed"
			)
		).length;
		const totalIncome = finances
			.filter((f) => f.type === "income")
			.reduce((sum, f) => sum + f.amount, 0);
		const totalExpense = finances
			.filter((f) => f.type === "expense")
			.reduce((sum, f) => sum + f.amount, 0);

		return [
			{
				title: "Total Tasks",
				value: totalTasks,
				icon: <CheckSquare size={24} />,
				color: "primary.main",
			},
			{
				title: "Completed Tasks",
				value: completedTasks,
				icon: <CheckCircle size={24} />,
				color: "success.main",
			},
			{
				title: "Total Income",
				value: `$${totalIncome.toLocaleString()}`,
				icon: <TrendingUp size={24} />,
				color: "success.main",
			},
			{
				title: "Total Expenses",
				value: `$${totalExpense.toLocaleString()}`,
				icon: <TrendingDown size={24} />,
				color: "error.main",
			},
		];
	};

	// Fetch all dashboard data
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [statusData, todos, finances, journals, events, blogs] =
					await Promise.all([
						fetchStatuses(),
						fetchTodos(),
						fetchFinances(),
						fetchJournals(),
						fetchEvents(),
						fetchBlogs(),
					]);

				setStatuses(statusData);
				setData({
					stats: calculateStats(todos, finances, statusData),
					chartData: calculateChartData(finances),
					todos,
					events,
					journals,
					blogs,
				});
			} catch (error: any) {
				console.error("Error fetching dashboard data:", error.message);
				setSnackbar({
					open: true,
					message: `Failed to load dashboard data: ${error.message}`,
					severity: "error",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Handle todo completion
	const handleComplete = async (id: string, isCompleted: boolean) => {
		if (!isCompleted) return; // Only handle marking as completed
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
			const todo = data.todos.find((t) => t.id === id);
			if (!todo) throw new Error("Todo not found");
			const response = await fetch("/api/todos", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id,
					status: completedStatus.id,
					title: todo.title,
					description: todo.description,
					priority: todo.priority,
					category: todo.category,
					dueDate: todo.dueDate,
				}),
			});
			if (response.ok) {
				const updatedTodo: TodoType = await response.json();
				setData((prev) => ({
					...prev,
					todos: prev.todos.map((t) =>
						t.id === updatedTodo.id ? updatedTodo : t
					),
					stats: prev.stats.map((stat) =>
						stat.title === "Completed Tasks"
							? { ...stat, value: Number(stat.value) + 1 }
							: stat
					),
				}));
				setSnackbar({
					open: true,
					message: "Todo marked as completed!",
					severity: "success",
				});
			} else {
				const errorData = await response.json();
				console.error("Error marking todo as completed:", errorData);
				setSnackbar({
					open: true,
					message: errorData.error || "Failed to mark todo as completed",
					severity: "error",
				});
			}
		} catch (error: any) {
			console.error("Error marking todo as completed:", error.message);
			setSnackbar({
				open: true,
				message: `Error marking todo as completed: ${error.message}`,
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	return {
		data,
		statuses,
		loading,
		snackbar,
		handleComplete,
		handleCloseSnackbar,
	};
}
