import {
	Dialog,
	TextField,
	MenuItem,
	Button,
	Box,
	Typography,
} from "@mui/material";
import { TodoType } from "@/types/interface";
import moment from "moment";

interface EventModalProps {
	open: boolean;
	onClose: () => void;
	event: {
		title: string;
		description: string;
		start: Date;
		end: Date;
		todo: string;
	};
	setEvent: (event: {
		title: string;
		description: string;
		start: Date;
		end: Date;
		todo: string;
	}) => void;
	todos: TodoType[];
	onSave: () => void;
	onDelete?: () => void;
}

export default function EventModal({
	open,
	onClose,
	event,
	setEvent,
	todos,
	onSave,
	onDelete,
}: EventModalProps) {
	return (
		<Dialog open={open} onClose={onClose}>
			<Box sx={{ p: 3, minWidth: 400 }}>
				<Typography variant="h6" gutterBottom>
					{onDelete ? "Edit Event" : "Add New Event"}
				</Typography>
				<TextField
					label="Title"
					value={event.title}
					onChange={(e) => setEvent({ ...event, title: e.target.value })}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Description"
					value={event.description}
					onChange={(e) => setEvent({ ...event, description: e.target.value })}
					fullWidth
					margin="normal"
					multiline
					rows={3}
				/>
				<TextField
					label="Start"
					type="datetime-local"
					value={moment(event.start).format("YYYY-MM-DDTHH:mm")}
					onChange={(e) =>
						setEvent({ ...event, start: new Date(e.target.value) })
					}
					fullWidth
					margin="normal"
					InputLabelProps={{ shrink: true }}
					required
				/>
				<TextField
					label="End"
					type="datetime-local"
					value={moment(event.end).format("YYYY-MM-DDTHH:mm")}
					onChange={(e) =>
						setEvent({ ...event, end: new Date(e.target.value) })
					}
					fullWidth
					margin="normal"
					InputLabelProps={{ shrink: true }}
					required
				/>
				<TextField
					select
					label="Todo (Optional)"
					value={event.todo}
					onChange={(e) => setEvent({ ...event, todo: e.target.value })}
					fullWidth
					margin="normal"
				>
					<MenuItem value="">None</MenuItem>
					{todos.map((todo) => (
						<MenuItem key={todo.id} value={todo.id}>
							{todo.title} ({moment(todo.dueDate).format("MMM D")})
						</MenuItem>
					))}
				</TextField>
				<Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
					<Box>
						{onDelete && (
							<Button variant="outlined" color="error" onClick={onDelete}>
								Delete
							</Button>
						)}
					</Box>
					<Box>
						<Button sx={{ mr: 1 }} variant="outlined" onClick={onClose}>
							Cancel
						</Button>
						<Button variant="contained" onClick={onSave}>
							Save
						</Button>
					</Box>
				</Box>
			</Box>
		</Dialog>
	);
}
