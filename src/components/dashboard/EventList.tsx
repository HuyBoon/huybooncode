import {
	Box,
	Card,
	CardContent,
	Typography,
	Divider,
	Stack,
} from "@mui/material";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { EventType } from "@/types/interface";

interface EventListProps {
	events: EventType[];
}

export default function EventList({ events }: EventListProps) {
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
						Upcoming Events
					</Typography>
					<Divider sx={{ mb: 2 }} />
					<Stack spacing={1}>
						{events.length === 0 ? (
							<Typography color="text.secondary">No upcoming events</Typography>
						) : (
							events.map((event) => (
								<Box
									key={event.id}
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 2,
										"&:hover": { bgcolor: "action.hover" },
									}}
								>
									<Calendar size={20} color="#0288d1" />
									<Typography variant="body2">{event.title}</Typography>
									<Typography variant="body2" color="text.secondary">
										{new Date(event.createdAt).toLocaleDateString()}
									</Typography>
								</Box>
							))
						)}
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}
