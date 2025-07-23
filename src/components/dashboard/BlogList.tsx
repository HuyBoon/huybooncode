import {
	Box,
	Card,
	CardContent,
	Typography,
	Divider,
	Stack,
} from "@mui/material";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { BlogType } from "@/types/interface";

interface BlogListProps {
	blogs: BlogType[];
}

export default function BlogList({ blogs }: BlogListProps) {
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
						Recent Blogs
					</Typography>
					<Divider sx={{ mb: 2 }} />
					<Stack spacing={1}>
						{blogs.length === 0 ? (
							<Typography color="text.secondary">No recent blogs</Typography>
						) : (
							blogs.map((blog) => (
								<Box
									key={blog.id}
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 2,
										"&:hover": { bgcolor: "action.hover" },
									}}
								>
									<FileText size={20} color="#0288d1" />
									<Typography variant="body2">{blog.title}</Typography>
									<Typography variant="body2" color="text.secondary">
										{new Date(blog.createdAt).toLocaleDateString()}
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
