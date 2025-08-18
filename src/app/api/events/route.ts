import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";

import Event from "@/models/Event";
import Todo from "@/models/Todo";
import mongoose from "mongoose";

export interface EventType {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    todo?: string;
    createdAt: string;
    updatedAt: string;
}

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const start = searchParams.get("start");
        const end = searchParams.get("end");

        const query: any = {};
        if (start && end) {
            query.start = { $gte: new Date(start) };
            query.end = { $lte: new Date(end) };
        }

        const events = await Event.find(query).populate("todo", "title dueDate");
        const todos = await Todo.find(start && end ? { dueDate: { $gte: start, $lte: end } } : {});

        const formattedEvents: EventType[] = events.map((event) => ({
            id: event._id.toString(),
            title: event.title,
            description: event.description || "",
            start: event.start.toISOString(),
            end: event.end.toISOString(),
            todo: event.todo ? event.todo._id.toString() : undefined,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        }));

        const formattedTodoEvents: EventType[] = todos.map((todo) => ({
            id: `todo-${todo._id.toString()}`,
            title: todo.title,
            description: todo.description || "",
            start: todo.dueDate,
            end: todo.dueDate,
            todo: todo._id.toString(),
            createdAt: todo.createdAt.toISOString(),
            updatedAt: todo.updatedAt.toISOString(),
        }));

        return NextResponse.json(
            {
                data: [...formattedEvents, ...formattedTodoEvents],
                pagination: {
                    total: events.length + todos.length,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching events:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch events", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { title, description, start, end, todo } = await request.json();

        if (!title || typeof title !== "string" || !title.trim()) {
            return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
        }
        if (!start || isNaN(new Date(start).getTime())) {
            return NextResponse.json({ error: "Valid start date is required" }, { status: 400 });
        }
        if (!end || isNaN(new Date(end).getTime())) {
            return NextResponse.json({ error: "Valid end date is required" }, { status: 400 });
        }
        if (todo && !mongoose.Types.ObjectId.isValid(todo)) {
            return NextResponse.json({ error: "Valid todo ID is required" }, { status: 400 });
        }

        if (todo) {
            const todoExists = await Todo.findById(todo);
            if (!todoExists) {
                return NextResponse.json({ error: "Todo not found" }, { status: 404 });
            }
        }

        const event = await Event.create({
            title: title.trim(),
            description: description?.trim(),
            start: new Date(start),
            end: new Date(end),
            todo: todo || null,
        });

        const populatedEvent = await Event.findById(event._id).populate("todo", "title dueDate");

        const formattedEvent: EventType = {
            id: populatedEvent._id.toString(),
            title: populatedEvent.title,
            description: populatedEvent.description || "",
            start: populatedEvent.start.toISOString(),
            end: populatedEvent.end.toISOString(),
            todo: populatedEvent.todo ? populatedEvent.todo._id.toString() : undefined,
            createdAt: populatedEvent.createdAt.toISOString(),
            updatedAt: populatedEvent.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedEvent, { status: 201 });
    } catch (error: any) {
        console.error("Error creating event:", error.message);
        return NextResponse.json(
            { error: "Failed to create event", details: error.message },
            { status: 500 }
        );
    }
}