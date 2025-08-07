import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TodoPageClient from "./TodoPageClient";
import { fetchTodoCategories, fetchTodos } from "@/utils/todoApi";
import { defaultStatuses } from "@/utils/constant";

export default async function TodoPage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}

	const [categories, todosData] = await Promise.all([
		fetchTodoCategories(),
		fetchTodos({ page: 1, limit: 10 }),
	]);

	return (
		<TodoPageClient
			initialTodos={todosData.data}
			initialCategories={categories}
			initialStatuses={defaultStatuses} 
			initialPagination={todosData.pagination}
		/>
	);
}
