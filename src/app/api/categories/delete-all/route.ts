import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Category from "@/models/Category";
import Todo from "@/models/Todo";

export async function DELETE() {
    await dbConnect();

    try {
        // Check if any todos reference categories
        const todoCount = await Todo.countDocuments({ category: { $exists: true } });
        if (todoCount > 0) {
            return NextResponse.json(
                { error: "Cannot delete categories while todos reference them" },
                { status: 400 }
            );
        }

        await Category.deleteMany({});
        return NextResponse.json(
            { message: "All todo categories deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting todo categories:", error);
        return NextResponse.json(
            { error: "Failed to delete todo categories" },
            { status: 500 }
        );
    }
}