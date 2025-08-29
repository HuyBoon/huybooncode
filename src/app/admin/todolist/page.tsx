import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import TodoPageClient from "./TodoPageClient";
import { getInitialTodos } from "@/services/todos/todoService";
import { defaultStatuses } from "@/utils/constant";
import Loader from "@/components/admin/Loader";

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

	if (initialError) {
		console.error("Error in TodoPage:", initialError);
		return (
			<div>
				<Loader />
			</div>
		);
	}

	return (
		<Suspense fallback={<Loader />}>
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
		</Suspense>
	);
}
