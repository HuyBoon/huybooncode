import { dbConnect } from "@/libs/dbConnection";
import Blog from "@/models/Blog";
import BlogCategory from "@/models/BlogCategory";
import BlogPageClient from "@/components/blog/BlogPageClient";
import { BlogType, BlogCategoryType, PaginationType } from "@/types/interface";

export default async function BlogsPage() {
	await dbConnect();
	let initialBlogs: BlogType[] = [];
	let initialCategories: BlogCategoryType[] = [];
	let initialPagination: PaginationType = {
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 1,
	};
	let initialError: string | null = null;

	try {
		const blogs = await Blog.find()
			.populate("blogcategory", "name")
			.sort({ createdAt: -1 })
			.limit(10);
		const total = await Blog.countDocuments();
		const categories = await BlogCategory.find();

		initialBlogs = blogs.map((blog) => ({
			id: blog._id.toString(),
			title: blog.title,
			slug: blog.slug,
			description: blog.description || "",
			introductions: blog.introductions || "",
			content: blog.content,
			blogcategory: blog.blogcategory?._id.toString() || "",
			status: blog.status,
			tags: blog.tags,
			thumbnail: blog.thumbnail || "",
			views: blog.views,
			createdAt: blog.createdAt.toISOString(),
			updatedAt: blog.updatedAt.toISOString(),
		}));

		initialCategories = categories.map((category) => ({
			id: category._id.toString(),
			name: category.name,
			createdAt: category.createdAt.toISOString(),
			updatedAt: category.updatedAt.toISOString(),
		}));

		initialPagination = {
			page: 1,
			limit: 10,
			total,
			totalPages: Math.ceil(total / 10),
		};
	} catch (error: any) {
		console.error("Error fetching initial blogs and categories:", error);
		initialError = "Failed to connect to database";
		initialBlogs = [
			{
				id: "temp-1",
				title: "Sample Blog Post",
				slug: "sample-blog-post",
				description: "This is a sample blog description",
				introductions: "This is a sample introduction",
				content: "This is a sample blog content",
				blogcategory: "temp-category-1",
				status: "draft",
				tags: ["sample", "test"],
				thumbnail: "",
				views: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		];
		initialCategories = [
			{
				id: "temp-category-1",
				name: "Sample Category",
			},
		];
	}

	return (
		<BlogPageClient
			initialBlogs={initialBlogs}
			initialCategories={initialCategories}
			initialPagination={initialPagination}
			initialError={initialError}
		/>
	);
}
