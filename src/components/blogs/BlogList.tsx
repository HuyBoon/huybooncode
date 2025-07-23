import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	Box,
} from "@mui/material";
import { BlogType } from "@/types/interface";

interface BlogListProps {
	blogs: BlogType[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export default function BlogList({ blogs, onEdit, onDelete }: BlogListProps) {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>Title</TableCell>
					<TableCell>Category</TableCell>
					<TableCell>Status</TableCell>
					<TableCell>Tags</TableCell>
					<TableCell>Views</TableCell>
					<TableCell>Actions</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{blogs.map((blog) => (
					<TableRow key={blog.id}>
						<TableCell>{blog.title}</TableCell>
						<TableCell>{blog.blogcategory}</TableCell>
						<TableCell>{blog.status}</TableCell>
						<TableCell>{blog.tags.join(", ")}</TableCell>
						<TableCell>{blog.views}</TableCell>
						<TableCell>
							<Button
								sx={{ mr: 1 }}
								variant="outlined"
								onClick={() => onEdit(blog.id)}
							>
								Edit
							</Button>
							<Button
								variant="outlined"
								color="error"
								onClick={() => onDelete(blog.id)}
							>
								Delete
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
