import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { fetchCategories, fetchFinances } from "@/utils/financeApi";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { StatusType } from "@/types/interface";
import { fetchTodoCategories, fetchTodos } from "@/utils/todoApi";
import { defaultStatuses } from "@/utils/constant";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}

	const [categories, transactionData, todocategories, todoData] =
		await Promise.all([
			fetchCategories(),
			fetchFinances({ period: "today" }),
			fetchTodoCategories(),
			fetchTodos({ period: "today" }),
		]);

	return (
		<DashboardLayout
			initialFinances={transactionData.data}
			initialCategories={categories}
			initialTodos={todoData.data}
			initialTodoCategories={todocategories}
			initialStatuses={defaultStatuses}
		/>
	);
}
