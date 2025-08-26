import React from "react";
import { Box, Card, Typography, CardContent, Divider } from "@mui/material";
import { BlogType, BlogCategoryType } from "@/types/interface";
import sanitizeHtml from "sanitize-html";

interface BlogDetailProps {
	blog: BlogType | null;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blog }) => {
	if (!blog) {
		return (
			<Box sx={{ p: 3, color: "white" }}>
				<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
					No Blog Selected
				</Typography>
				<Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
					Select a blog to view details
				</Typography>
			</Box>
		);
	}

	return (
		<Card
			elevation={0}
			sx={{
				background: "transparent",
				color: "white",
				borderRadius: "16px",
				p: 3,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<CardContent sx={{ px: 3, flexGrow: 1 }}>
				<Typography
					variant="h4"
					gutterBottom
					sx={{
						fontWeight: "bold",
						color: "white",
						textAlign: "center",
						mb: 2,
						fontSize: "1.3rem",
						letterSpacing: "1px",
					}}
				>
					{blog.title}
				</Typography>
				<Divider sx={{ borderColor: "rgba(255, 255, 255, 0.3)", mb: 2 }} />
				{blog.thumbnail && (
					<Box
						component="img"
						src={blog.thumbnail}
						alt={blog.title}
						sx={{
							width: "100%",
							maxHeight: 200,
							objectFit: "cover",
							borderRadius: "8px",
							mb: 2,
						}}
					/>
				)}
				<Box
					sx={{
						background: "rgba(255, 255, 255, 0.05)",
						borderRadius: "8px",
						p: 2,
						mb: 3,
						"& p": {
							color: "white",
							fontSize: "1.1rem",
							lineHeight: 1.6,
							margin: 0,
						},
					}}
					dangerouslySetInnerHTML={{
						__html: sanitizeHtml(blog.content, {
							allowedTags: ["p", "b", "i", "u", "ul", "ol", "li", "a"],
							allowedAttributes: { a: ["href"] },
						}),
					}}
				/>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Slug: {blog.slug}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Description: {blog.description || "N/A"}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Introductions: {blog.introductions || "N/A"}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Status: {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Tags: {blog.tags.length > 0 ? blog.tags.join(", ") : "N/A"}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Views: {blog.views}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Created:{" "}
						{new Date(blog.createdAt).toLocaleString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
					>
						Updated:{" "}
						{new Date(blog.updatedAt).toLocaleString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

export default BlogDetail;
