import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Status from "@/models/Status";
import Todo from "@/models/Todo";

export async function DELETE() {
    await dbConnect();

    try {
        // Check if any todos reference statuses
        const todoCount = await Todo.countDocuments({ status: { $exists: true } });
        if (todoCount > 0) {
            return NextResponse.json(
                { error: "Cannot delete statuses because they are used by todos" },
                { status: 400 }
            );
        }

        await Status.deleteMany({});
        return NextResponse.json(
            { message: "All statuses deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE /statuses/delete-all error:", error);
        return NextResponse.json(
            { error: "Failed to delete statuses" },
            { status: 500 }
        );
    }
}