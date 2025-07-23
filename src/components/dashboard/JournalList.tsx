import {
	Box,
	Card,
	CardContent,
	Typography,
	Divider,
	Stack,
} from "@mui/material";
import { NotebookPen } from "lucide-react";
import { motion } from "framer-motion";
import { JournalType } from "@/types/interface";

interface JournalListProps {
	journals: JournalType[];
}

export default function JournalList({ journals }: JournalListProps) {
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
						Recent Journals
					</Typography>
					<Divider sx={{ mb: 2 }} />
					<Stack spacing={1}>
						{journals.length === 0 ? (
							<Typography color="text.secondary">No recent journals</Typography>
						) : (
							journals.map((journal) => (
								<Box
									key={journal.id}
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 2,
										"&:hover": { bgcolor: "action.hover" },
									}}
								>
									<NotebookPen size={20} color="#0288d1" />
									<Typography variant="body2">{journal.title}</Typography>
									<Typography variant="body2" color="text.secondary">
										{new Date(journal.date).toLocaleDateString()}
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
