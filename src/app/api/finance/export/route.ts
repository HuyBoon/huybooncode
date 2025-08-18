import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";

import Finance from "@/models/Finance";
import * as XLSX from "xlsx";

export async function GET() {
    try {
        await dbConnect();

        const finances = await Finance.find().populate("category", "name");

        const data = finances.map((item) => ({
            Type: item.type,
            Amount: item.amount,
            Category: item.category?.name || "",
            Description: item.description || "",
            Date: item.date.toISOString().split("T")[0],
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Finances");

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=finances.xlsx",
            },
        });
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
