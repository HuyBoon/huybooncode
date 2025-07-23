"use client";

import { Box, Stack, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Loader from "@/components/admin/Loader";
import useDashboardData from "@/hooks/useDashboardData";
import {
	CheckSquare,
	CheckCircle,
	TrendingUp,
	TrendingDown,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewSection from "@/components/dashboard/OverviewSection";
import FinanceChart from "@/components/dashboard/FinanceChart";
import TodoTable from "@/components/dashboard/TodoTable";
import EventList from "@/components/dashboard/EventList";
import JournalList from "@/components/dashboard/JournalList";
import BlogList from "@/components/dashboard/BlogList";
import ActionButton from "@/components/dashboard/ActionButton";
import ErrorSnackbar from "@/components/dashboard/ErrorSnackbar";

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const {
		data,
		statuses,
		loading,
		snackbar,
		handleComplete,
		handleCloseSnackbar,
	} = useDashboardData();

	console.log("data", data);

	if (status === "loading") {
		return <Loader />;
	}

	if (status === "unauthenticated") {
		router.push("/login");
		return null;
	}

	return (
		<Box
			component={motion.div}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			sx={{ maxWidth: "lg", mx: "auto", py: 8 }}
		>
			<Stack spacing={3}>
				<DashboardHeader session={session} />

				{loading ? (
					<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
						<CircularProgress />
					</Box>
				) : (
					<>
						<OverviewSection stats={data.stats} />
						<FinanceChart chartData={data.chartData} />
						<TodoTable
							todos={data.todos}
							statuses={statuses}
							handleComplete={handleComplete}
							loading={loading}
						/>
						<EventList events={data.events} />
						<JournalList journals={data.journals} />
						<BlogList blogs={data.blogs} />
						<ActionButton />
					</>
				)}

				<ErrorSnackbar
					open={snackbar.open}
					message={snackbar.message}
					severity={snackbar.severity}
					onClose={handleCloseSnackbar}
				/>
			</Stack>
		</Box>
	);
}
