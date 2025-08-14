import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TodoPageClient from "./TodoPageClient";
import { fetchTodoCategories, fetchTodos } from "@/utils/todoApi";
import { defaultStatuses } from "@/utils/constant";
import Loader from "@/components/admin/Loader";

export default async function TodoPage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}

	try {
		const [categories, todosData] = await Promise.all([
			fetchTodoCategories(),
			fetchTodos({ page: 1, limit: 10, period: "today" }),
		]);

		console.log("fetchedTodos:", todosData.data);
		return (
			<TodoPageClient
				initialTodos={todosData.data}
				initialCategories={categories}
				initialStatuses={defaultStatuses}
				initialPagination={todosData.pagination}
			/>
		);
	} catch (error: any) {
		console.error("Error in TodoPage:", error.message);

		return (
			<div>
				<Loader />
			</div>
		);
	}
}
