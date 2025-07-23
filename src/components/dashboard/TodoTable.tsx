import {
	Box,
	Card,
	CardContent,
	Typography,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Chip,
	Checkbox,
} from "@mui/material";
import { motion } from "framer-motion";
import { TodoType, StatusType } from "@/types/interface";

interface TodoTableProps {
	todos: TodoType[];
	statuses: StatusType[];
	handleComplete: (id: string, isCompleted: boolean) => void;
	loading: boolean;
}

export default function TodoTable({
	todos,
	statuses,
	handleComplete,
	loading,
}: TodoTableProps) {
	const getStatusName = (statusId: string) =>
		statuses.find((s) => s.id === statusId)?.name || "Unknown";
	const isCompleted = (statusId: string) =>
		statuses.find((s) => s.id === statusId)?.name.toLowerCase() === "completed";

	return (
		<Box
			component={motion.div}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Card sx={{ boxShadow: 3, bgcolor: "background.paper", mt: 4 }}>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: "medium", mb: 2 }}>
						To-Do List (Today)
					</Typography>
					<Divider sx={{ mb: 2 }} />
					<Table sx={{ minWidth: { xs: "auto", md: 650 } }}>
						<TableHead>
							<TableRow>
								<TableCell>Completed</TableCell>
								<TableCell>Task</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Due Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{todos.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} align="center">
										No todos due today
									</TableCell>
								</TableRow>
							) : (
								todos.map((todo: TodoType) => (
									<TableRow
										key={todo.id}
										sx={{ "&:hover": { bgcolor: "action.hover" } }}
									>
										<TableCell>
											<Checkbox
												checked={isCompleted(todo.status)}
												onChange={(e) =>
													handleComplete(todo.id, e.target.checked)
												}
												disabled={loading || isCompleted(todo.status)}
												aria-label={`Mark ${todo.title} as completed`}
											/>
										</TableCell>
										<TableCell>{todo.title}</TableCell>
										<TableCell>
											<Chip
												label={getStatusName(todo.status)}
												color={isCompleted(todo.status) ? "success" : "warning"}
												size="small"
											/>
										</TableCell>
										<TableCell>
											{new Date(todo.dueDate).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</Box>
	);
}
