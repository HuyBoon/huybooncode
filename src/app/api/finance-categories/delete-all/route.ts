// /app/api/finance-categories/delete-all/route.ts
import { NextResponse } from "next/server";

import FinanceCategory from "@/models/FinanceCategory";
import { dbConnect } from "@/libs/dbConnect";

export async function DELETE() {
    try {
        await dbConnect();
        const result = await FinanceCategory.deleteMany({});
        return NextResponse.json(
            { message: `Deleted ${result.deletedCount} categories.` },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete categories" },
            { status: 500 }
        );
    }
}
