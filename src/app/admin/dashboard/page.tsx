import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { fetchCategories, fetchFinances } from "@/services/finances/financeApi";
import { fetchTodoCategories, fetchTodos } from "@/services/todos/todoApi";
import { defaultStatuses } from "@/utils/constant";
import Loader from "@/components/admin/Loader";
import DashboardPageClient from "./DashboardPageClient";
import { dbConnect } from "@/libs/dbConnection";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}
	await dbConnect();

	try {
		const [categories, transactionData, todocategories, todoData] =
			await Promise.all([
				fetchCategories(),
				fetchFinances({ period: "today" }),
				fetchTodoCategories(),
				fetchTodos({ period: "today" }),
			]);

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
		return (
			<div>
				<Loader />
			</div>
		);
	}
}
