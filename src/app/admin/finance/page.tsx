import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import {
	fetchCategories,
	fetchFinances,
	fetchSummaryFinances,
} from "@/services/finances/financeApi";
import FinancePageClient from "./FinancePageClient";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
	const session = await getServerSession();
	if (!session) {
		redirect("/login");
	}

	const [categories, transactionData] = await Promise.all([
		fetchCategories(),
		fetchFinances({ period: "today" }),
	]);

	return (
		<FinancePageClient
			initialFinances={transactionData.data}
			initialCategories={categories}
			initialPagination={transactionData.pagination}
		/>
	);
}
