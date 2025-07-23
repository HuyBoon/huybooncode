import { Card, CardContent, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface OverviewCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
	index: number;
}

export default function OverviewCard({
	title,
	value,
	icon,
	color,
	index,
}: OverviewCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3, delay: index * 0.1 }}
		>
			<Card
				sx={{
					boxShadow: 3,
					bgcolor: "background.paper",
					"&:hover": { boxShadow: 6 },
					transition: "box-shadow 0.2s",
				}}
			>
				<CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Box sx={{ color, display: "flex", alignItems: "center" }}>
						{icon}
					</Box>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: "medium" }}>
							{value}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{title}
						</Typography>
					</Box>
				</CardContent>
			</Card>
		</motion.div>
	);
}
