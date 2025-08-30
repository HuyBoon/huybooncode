import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import TodoPageClient from "./TodoPageClient";
import { getInitialTodos } from "@/services/todos/todoService";
import { defaultStatuses } from "@/utils/constant";

export default async function TodoPage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}

	const {
		initialTodos,
		initialTodoCategories,
		initialPagination,
		initialError,
	} = await getInitialTodos(10);

	return (
		<TodoPageClient
			initialTodos={initialTodos.map((todo) => ({
				...todo,
				priority: (["low", "medium", "high"].includes(todo.priority)
					? todo.priority
					: "low") as "low" | "medium" | "high",
			}))}
			initialCategories={initialTodoCategories}
			initialStatuses={defaultStatuses}
			initialPagination={initialPagination}
		/>
	);
}
