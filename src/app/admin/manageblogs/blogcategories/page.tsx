import { dbConnect } from "@/libs/dbConnection";
import BlogCategoryModel from "@/models/BlogCategory";
import BlogCategory from "@/components/blog/BlogCategory";
import { BlogCategoryType } from "@/types/interface";

export default async function BlogCategoriesPage() {
	await dbConnect();
	let initialCategories: BlogCategoryType[] = [];
	let initialError: string | null = null;

	try {
		const categories = await BlogCategoryModel.find().sort({ name: 1 });
		initialCategories = categories.map((cat) => ({
			id: cat._id.toString(),
			name: cat.name,
		}));
	} catch (error: any) {
		console.error("Error fetching initial categories:", error);
		initialError = "Failed to connect to database";
		initialCategories = [
			{
				id: "temp-1",
				name: "Sample Category",
			},
		];
	}

	return (
		<BlogCategory
			initialCategories={initialCategories}
			initialError={initialError}
		/>
	);
}
