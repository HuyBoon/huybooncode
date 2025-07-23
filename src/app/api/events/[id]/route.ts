import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import Event from "@/models/Event";
import Todo from "@/models/Todo";
import mongoose from "mongoose";
import { EventType } from "@/app/api/events/route";

export async function GET(req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Valid event ID is required" }, { status: 400 });
        }

        const event = await Event.findById(id).populate("todo", "title dueDate");
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const formattedEvent: EventType = {
            id: event._id.toString(),
            title: event.title,
            description: event.description || "",
            start: event.start.toISOString(),
            end: event.end.toISOString(),
            todo: event.todo ? event.todo._id.toString() : undefined,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedEvent, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching event:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch event", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await context.params;
        const { title, description, start, end, todo } = await req.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Valid event ID is required" }, { status: 400 });
        }
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

        const event = await Event.findByIdAndUpdate(
            id,
            {
                title: title.trim(),
                description: description?.trim(),
                start: new Date(start),
                end: new Date(end),
                todo: todo || null,
            },
            { new: true, runValidators: true }
        ).populate("todo", "title dueDate");

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const formattedEvent: EventType = {
            id: event._id.toString(),
            title: event.title,
            description: event.description || "",
            start: event.start.toISOString(),
            end: event.end.toISOString(),
            todo: event.todo ? event.todo._id.toString() : undefined,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        };

        return NextResponse.json(formattedEvent, { status: 200 });
    } catch (error: any) {
        console.error("Error updating event:", error.message);
        return NextResponse.json(
            { error: "Failed to update event", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest,
    context: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Valid event ID is required" }, { status: 400 });
        }

        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting event:", error.message);
        return NextResponse.json(
            { error: "Failed to delete event", details: error.message },
            { status: 500 }
        );
    }
}