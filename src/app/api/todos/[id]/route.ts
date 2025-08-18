import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";

import Todo from "@/models/Todo";
import { TodoType } from "@/types/interface";
import mongoose from "mongoose";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
        }

        const todo = await Todo.findById(id).populate("category", "name");
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
            notifyEnabled: todo.notifyEnabled,
            notifyMinutesBefore: todo.notifyMinutesBefore,
            notificationSent: todo.notificationSent,
        };

        return NextResponse.json(formattedTodo, { status: 200 });
    } catch (error) {
        console.error("Error fetching todo:", error);
        return NextResponse.json(
            { error: "Failed to fetch todo" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await context.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
        }

        const {
            title,
            description,
            status,
            priority,
            category,
            dueDate,
            notifyEnabled,
            notifyMinutesBefore,
            notificationSent,
        } = await req.json();

        // Validate inputs
        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
        }
        if (!status || !["Pending", "In Progress", "Completed"].includes(status)) {
            return NextResponse.json(
                { error: "Valid status (Pending, In Progress, Completed) is required" },
                { status: 400 }
            );
        }
        if (!priority || !["low", "medium", "high"].includes(priority)) {
            return NextResponse.json(
                { error: "Valid priority (low, medium, high) is required" },
                { status: 400 }
            );
        }
        if (!category || !mongoose.Types.ObjectId.isValid(category)) {
            return NextResponse.json(
                { error: "Valid category ID is required" },
                { status: 400 }
            );
        }
        if (!dueDate || isNaN(new Date(dueDate).getTime())) {
            return NextResponse.json(
                { error: "Valid due date is required" },
                { status: 400 }
            );
        }
        if (typeof notifyEnabled !== "boolean") {
            return NextResponse.json(
                { error: "notifyEnabled must be a boolean" },
                { status: 400 }
            );
        }
        if (notifyEnabled && (typeof notifyMinutesBefore !== "number" || notifyMinutesBefore < 0)) {
            return NextResponse.json(
                { error: "notifyMinutesBefore must be a non-negative number" },
                { status: 400 }
            );
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
                notifyEnabled,
                notifyMinutesBefore,
                notificationSent: notificationSent ?? false,
            },
            { new: true, runValidators: true }
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
            notifyEnabled: todo.notifyEnabled,
            notifyMinutesBefore: todo.notifyMinutesBefore,
            notificationSent: todo.notificationSent,
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

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
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
    } catch (error: any) {
        console.error("Error deleting todo:", error);
        return NextResponse.json(
            { error: "Failed to delete todo", details: error.message },
            { status: 500 }
        );
    }
}