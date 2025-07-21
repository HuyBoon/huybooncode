import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Status from "@/models/Status";
import { StatusType } from "@/types/interface";

// Helper: Format document to API type
const formatStatus = (status: any): StatusType => ({
    id: status._id.toString(),
    name: status.name,
    icon: status.icon,
});

export async function GET() {
    await dbConnect();
    try {
        const statuses = await Status.find().sort({ name: 1 }).lean();
        const formattedStatuses: StatusType[] = statuses.map(formatStatus);
        return NextResponse.json(formattedStatuses, { status: 200 });
    } catch (error) {
        console.error("GET /statuses error:", error);
        return NextResponse.json({ error: "Failed to fetch statuses" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { name, icon } = await req.json();

        // Validate input
        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { error: "Status name is required and must be a non-empty string" },
                { status: 400 }
            );
        }
        if (!icon || typeof icon !== "string" || !icon.trim()) {
            return NextResponse.json(
                { error: "Status icon is required and must be a non-empty string" },
                { status: 400 }
            );
        }

        // Check for duplicate name
        const existingStatus = await Status.findOne({ name: name.trim() });
        if (existingStatus) {
            return NextResponse.json(
                { error: "Status name must be unique" },
                { status: 400 }
            );
        }

        // Create new status
        const status = await Status.create({
            name: name.trim(),
            icon: icon.trim(),
        });

        return NextResponse.json(formatStatus(status), { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "Status name must be unique" },
                { status: 400 }
            );
        }
        console.error("POST /statuses error:", error);
        return NextResponse.json(
            { error: "Failed to create status", details: error.message },
            { status: 500 }
        );
    }
}