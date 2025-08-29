import { dbConnect } from "@/libs/dbConnection";
import Finance from "@/models/Finance";
import FinanceCategory from "@/models/FinanceCategory";
import { FinanceType, FinanceCategoryType, PaginationType } from "@/types/interface";

export async function getInitialFinances(limit = 10) {
    await dbConnect();

    let initialFinances: FinanceType[] = [];
    let initialCategories: FinanceCategoryType[] = [];
    let initialPagination: PaginationType = {
        page: 1,
        limit,
        total: 0,
        totalPages: 1,
    };
    let initialError: string | null = null;

    try {
        // Fetch finance categories
        const financeCategories = await FinanceCategory.find();
        initialCategories = financeCategories.map((cat) => ({
            id: cat._id.toString(),
            name: cat.name,
            type: cat.type,
            createdAt: cat.createdAt.toISOString(),
            updatedAt: cat.updatedAt.toISOString(),
        }));

        // Fetch finances for today
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const finances = await Finance.find({
            date: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        })
            .sort({ date: -1 })
            .limit(limit);

        const totalFinances = await Finance.countDocuments({
            date: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        initialFinances = finances.map((finance) => ({
            id: finance._id.toString(),
            type: finance.type,
            amount: finance.amount,
            category: finance.category,
            description: finance.description || "",
            date: finance.date.toISOString(),
            createdAt: finance.createdAt.toISOString(),
            updatedAt: finance.updatedAt.toISOString(),
        }));

        initialPagination = {
            page: 1,
            limit,
            total: totalFinances,
            totalPages: Math.ceil(totalFinances / limit),
        };

        return { initialFinances, initialCategories, initialPagination, initialError: null };
    } catch (error: any) {
        console.error("Error fetching initial finance data:", error);
        initialError = "Failed to connect to database";

        return {
            initialFinances: [
                {
                    id: "temp-finance-1",
                    type: "expense",
                    amount: 100,
                    category: "Sample Category",
                    description: "Sample finance",
                    date: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
            initialCategories: [
                {
                    id: "temp-cat-1",
                    name: "Sample Category",
                    type: "expense",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
            initialPagination: {
                page: 1,
                limit,
                total: 1,
                totalPages: 1,
            },
            initialError,
        };
    }
}

export async function getFinanceCategories(): Promise<FinanceCategoryType[]> {
    await dbConnect();

    try {
        const financeCategories = await FinanceCategory.find();
        return financeCategories.map((cat) => ({
            id: cat._id.toString(),
            name: cat.name,
            type: cat.type,
            createdAt: cat.createdAt.toISOString(),
            updatedAt: cat.updatedAt.toISOString(),
        }));
    } catch (error: any) {
        console.error("Error fetching finance categories:", error);
        return [
            {
                id: "temp-cat-1",
                name: "Sample Category",
                type: "Expense",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
    }
}