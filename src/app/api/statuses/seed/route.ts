import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Status from "@/models/Status";
import { StatusType } from "@/types/interface";

const defaultStatuses = [
    { name: "Pending", icon: "⏳" },
    { name: "In Progress", icon: "🔄" },
    { name: "Completed", icon: "✅" },
];

// Helper: Format document to API type
const formatStatus = (status: any): StatusType => ({
    id: status._id.toString(),
    name: status.name,
    icon: status.icon,
});

export async function POST() {
    await dbConnect();

    try {
        const count = await Status.countDocuments();
        if (count > 0) {
            return NextResponse.json(
                { error: "Statuses already exist" },
                { status: 400 }
            );
        }

        const inserted = await Status.insertMany(defaultStatuses);
        const formattedStatuses: StatusType[] = inserted.map(formatStatus);
        return NextResponse.json(
            {
                message: "Statuses seeded successfully",
                statuses: formattedStatuses,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error seeding statuses:", error);
        return NextResponse.json(
            { error: "Failed to seed statuses" },
            { status: 500 }
        );
    }
}