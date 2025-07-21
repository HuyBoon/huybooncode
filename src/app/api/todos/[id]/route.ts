import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Todo from "@/models/Todo";
import { TodoType } from "@/types/interface";
import mongoose from "mongoose";

export async function PUT(req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
        }

        const { title, description, status, priority, category, dueDate } = await req.json();

        // Validate inputs
        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
        }
        if (!status || !["pending", "completed"].includes(status)) {
            return NextResponse.json({ error: "Valid status (pending, completed) is required" }, { status: 400 });
        }
        if (!priority || !["low", "medium", "high"].includes(priority)) {
            return NextResponse.json({ error: "Valid priority (low, medium, high) is required" }, { status: 400 });
        }
        if (!category || !mongoose.Types.ObjectId.isValid(category)) {
            return NextResponse.json({ error: "Valid category ID is required" }, { status: 400 });
        }
        if (!dueDate || isNaN(new Date(dueDate).getTime())) {
            return NextResponse.json({ error: "Valid due date is required" }, { status: 400 });
        }

        const todo = await Todo.findByIdAndUpdate(
            id,
            {
                title: title.trim(),
                description: description?.trim(),
                status,
                priority,
                category,
                dueDate: new Date(dueDate),
            },
            { new: true }
        ).populate("category", "name");

        if (!todo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }

        const formattedTodo: TodoType = {
            id: todo._id.toString(),
            title: todo.title,
            description: todo.description || "",
            status: todo.status,
            priority: todo.priority,
            category: todo.category._id.toString(),
            dueDate: todo.dueDate.toISOString(),
            createdAt: todo.createdAt.toISOString(),
            updatedAt: todo.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedTodo, { status: 200 });
    } catch (error: any) {
        console.error("Error updating todo:", error);
        return NextResponse.json(
            { error: "Failed to update todo", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await context.params;


    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
        }

        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting todo:", error);
        return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
    }
}