import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { fetchCategories, fetchFinances } from "@/utils/financeApi";

import { fetchTodoCategories, fetchTodos } from "@/utils/todoApi";
import { defaultStatuses } from "@/utils/constant";
import Loader from "@/components/admin/Loader";
import DashboardPageClient from "./DashboardPageClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const session = await getServerSession();
	console.log("session", session);
	if (!session) {
		redirect("/login");
	}

	try {
		const [categories, transactionData, todocategories, todoData] =
			await Promise.all([
				fetchCategories(),
				fetchFinances({ period: "today" }),
				fetchTodoCategories(),
				fetchTodos({ period: "today" }),
			]);
		console.log(categories, transactionData);
		return (
			<DashboardPageClient
				initialFinances={transactionData.data}
				initialCategories={categories}
				initialTodos={todoData.data}
				initialTodoCategories={todocategories}
				initialStatuses={defaultStatuses}
				initialPagination={transactionData.pagination}
			/>
		);
	} catch (error: any) {
		console.error("Error in DashboardPage:", error.message);
		return (
			<div>
				<Loader />
			</div>
		);
	}
}
