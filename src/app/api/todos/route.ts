import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";

import Todo from "@/models/Todo";
import "@/models/Category";
import { TodoType } from "@/types/interface";
import mongoose from "mongoose";
import { defaultStatuses } from "@/utils/constant";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
    await dbConnect();
    try {

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const dueDate = searchParams.get("dueDate") || null;
        const dateTimeRange = searchParams.get("dateTimeRange") ? JSON.parse(searchParams.get("dateTimeRange") || "{}") : null;
        const status = searchParams.get("status") || null;
        const priority = searchParams.get("priority") || null;
        const category = searchParams.get("category") || null;
        const notifyEnabled = searchParams.get("notifyEnabled") || null;
        const notificationSent = searchParams.get("notificationSent") || null;
        const period = searchParams.get("period") || null;

        const query: any = {};

        // Ưu tiên period, chỉ áp dụng dueDate nếu period không được gửi
        if (period && period !== "all") {
            const now = new Date();
            if (period === "today") {
                query.dueDate = {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                };
            } else if (period === "week") {
                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                query.dueDate = {
                    $gte: startOfWeek,
                    $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
                };
            } else if (period === "month") {
                query.dueDate = {
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
                };
            }
        } else if (dueDate) {
            const [year, month] = dueDate.split("-").map(Number);
            query.dueDate = {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            };
        }

        if (dateTimeRange && dateTimeRange.start && dateTimeRange.end) {
            query.dueDate = {
                $gte: new Date(dateTimeRange.start),
                $lte: new Date(dateTimeRange.end),
            };
        }

        if (status && status !== "all" && defaultStatuses.some((s) => s.name === status)) {
            query.status = status;
        }
        if (priority && ["low", "medium", "high"].includes(priority)) {
            query.priority = priority;
        }
        if (category && category !== "all" && mongoose.Types.ObjectId.isValid(category)) {
            query.category = category;
        }
        if (notifyEnabled !== null) {
            query.notifyEnabled = notifyEnabled === "true";
        }
        if (notificationSent !== null) {
            query.notificationSent = notificationSent === "true";
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const total = await Todo.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Fetch todos with populated category
        const todos = await Todo.find(query)
            .populate("category", "name")
            .sort({ dueDate: -1 })
            .skip(skip)
            .limit(limit);

        const formattedTodos: TodoType[] = todos.map((todo) => ({
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
    } catch (error: any) {
        console.error("Error fetching todos:", error);
        return NextResponse.json({ error: "Failed to fetch todos", details: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();
    try {


        const { title, description, status, priority, category, dueDate, notifyEnabled, notifyMinutesBefore } = await request.json();

        // Validate inputs
        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
        }
        if (!status || !defaultStatuses.some((s) => s.name === status)) {
            return NextResponse.json({ error: "Valid status (Pending, In Progress, Completed) is required" }, { status: 400 });
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
        if (typeof notifyEnabled !== "boolean") {
            return NextResponse.json({ error: "notifyEnabled must be a boolean" }, { status: 400 });
        }
        if (notifyEnabled && (typeof notifyMinutesBefore !== "number" || notifyMinutesBefore < 0)) {
            return NextResponse.json({ error: "notifyMinutesBefore must be a non-negative number" }, { status: 400 });
        }

        const todo = await Todo.create({
            title: title.trim(),
            description: description?.trim(),
            status,
            priority,
            category,
            dueDate: new Date(dueDate),
            notifyEnabled,
            notifyMinutesBefore: notifyEnabled ? notifyMinutesBefore : 15,
            notificationSent: false,

        });

        const populatedTodo = await Todo.findById(todo._id).populate("category", "name");

        if (!populatedTodo) {
            return NextResponse.json({ error: "Failed to populate created todo" }, { status: 500 });
        }

        const formattedTodo: TodoType = {
            id: populatedTodo._id.toString(),
            title: populatedTodo.title,
            description: populatedTodo.description || "",
            status: populatedTodo.status,
            priority: populatedTodo.priority,
            category: populatedTodo.category._id.toString(),
            dueDate: populatedTodo.dueDate.toISOString(),
            createdAt: populatedTodo.createdAt.toISOString(),
            updatedAt: populatedTodo.updatedAt.toISOString(),
            notifyEnabled: populatedTodo.notifyEnabled,
            notifyMinutesBefore: populatedTodo.notifyMinutesBefore,
            notificationSent: populatedTodo.notificationSent,
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