import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Todo from "@/models/Todo";
import Status from "@/models/Status";
import "@/models/Category";
import { TodoType } from "@/types/interface";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const dueDate = searchParams.get("dueDate") || null;
        const status = searchParams.get("status") || null;
        const priority = searchParams.get("priority") || null;
        const category = searchParams.get("category") || null;

        // Build query
        const query: any = {};
        if (dueDate) {
            const [year, month] = dueDate.split("-").map(Number);
            query.dueDate = {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            };
        }
        if (status && status !== "all" && mongoose.Types.ObjectId.isValid(status)) {
            query.status = status;
        }
        if (priority && ["low", "medium", "high"].includes(priority)) {
            query.priority = priority;
        }
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.category = category;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const total = await Todo.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Fetch todos with populated status and category
        const todos = await Todo.find(query)
            .populate("status", "name icon")
            .populate("category", "name")
            .sort({ dueDate: -1 })
            .skip(skip)
            .limit(limit);

        const formattedTodos: TodoType[] = todos.map((todo) => ({
            id: todo._id.toString(),
            title: todo.title,
            description: todo.description || "",
            status: todo.status._id.toString(),
            priority: todo.priority,
            category: todo.category._id.toString(),
            dueDate: todo.dueDate.toISOString(),
            createdAt: todo.createdAt.toISOString(),
            updatedAt: todo.updatedAt.toISOString(),
        }));

        return NextResponse.json(
            {
                data: formattedTodos,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching todos:", error);
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { title, description, status, priority, category, dueDate } = await request.json();

        // Validate inputs
        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
        }
        if (!status || !mongoose.Types.ObjectId.isValid(status)) {
            return NextResponse.json({ error: "Valid status ID is required" }, { status: 400 });
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

        // Verify status exists
        const statusExists = await Status.findById(status);
        if (!statusExists) {
            return NextResponse.json({ error: "Status not found" }, { status: 404 });
        }

        const todo = await Todo.create({
            title: title.trim(),
            description: description?.trim(),
            status,
            priority,
            category,
            dueDate: new Date(dueDate),
        });

        const populatedTodo = await Todo.findById(todo._id)
            .populate("status", "name icon")
            .populate("category", "name");

        if (!populatedTodo) {
            return NextResponse.json({ error: "Failed to populate created todo" }, { status: 500 });
        }

        const formattedTodo: TodoType = {
            id: populatedTodo._id.toString(),
            title: populatedTodo.title,
            description: populatedTodo.description || "",
            status: populatedTodo.status._id.toString(),
            priority: populatedTodo.priority,
            category: populatedTodo.category._id.toString(),
            dueDate: populatedTodo.dueDate.toISOString(),
            createdAt: populatedTodo.createdAt.toISOString(),
            updatedAt: populatedTodo.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedTodo, { status: 201 });
    } catch (error: any) {
        console.error("Error creating todo:", error);
        return NextResponse.json(
            { error: "Failed to create todo", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    await dbConnect();
    try {
        const { id, title, description, status, priority, category, dueDate } = await request.json();

        // Validate inputs
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Valid todo ID is required" }, { status: 400 });
        }
        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
        }
        if (!status || !mongoose.Types.ObjectId.isValid(status)) {
            return NextResponse.json({ error: "Valid status ID is required" }, { status: 400 });
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

        // Verify status exists
        const statusExists = await Status.findById(status);
        if (!statusExists) {
            return NextResponse.json({ error: "Status not found" }, { status: 404 });
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
            { new: true, runValidators: true }
        )
            .populate("status", "name icon")
            .populate("category", "name");

        if (!todo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }

        const formattedTodo: TodoType = {
            id: todo._id.toString(),
            title: todo.title,
            description: todo.description || "",
            status: todo.status._id.toString(),
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

export async function DELETE(request: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Valid todo ID is required" }, { status: 400 });
        }

        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting todo:", error);
        return NextResponse.json(
            { error: "Failed to delete todo", details: error.message },
            { status: 500 }
        );
    }
}