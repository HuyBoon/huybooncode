import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { fetchCategories, fetchFinances } from "@/utils/financeApi";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}

	const [categories, transactionData] = await Promise.all([
		fetchCategories(),
		fetchFinances({ period: "today" }),
	]);

	console.log("initialCategories in DashboardPage:", categories);
	console.log("initialFinances in DashboardPage:", transactionData.data);

	return (
		<DashboardLayout
			initialFinances={transactionData.data}
			initialCategories={categories}
		/>
	);
}
