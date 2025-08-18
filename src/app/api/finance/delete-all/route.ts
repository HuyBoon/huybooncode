import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";

import Finance from "@/models/Finance";

export async function DELETE() {
    try {
        await dbConnect();
        const result = await Finance.deleteMany({});
        return NextResponse.json(
            {
                message: "All finance records deleted successfully",
                deletedCount: result.deletedCount,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete all error:", error);
        return NextResponse.json(
            { error: "Failed to delete finance records" },
            { status: 500 }
        );
    }
}
