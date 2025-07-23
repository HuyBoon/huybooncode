"use client";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

import { EventType, TodoType } from "@/types/interface";
import moment from "moment";
import CalendarView from "@/components/calendar/CalendarView";
import EventModal from "@/components/calendar/EventModal";

interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	todo?: string;
}

export default function CalendarPage() {
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [todos, setTodos] = useState<TodoType[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
	const [newEvent, setNewEvent] = useState({
		title: "",
		description: "",
		start: new Date(),
		end: new Date(),
		todo: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const start = moment().startOf("month").toISOString();
				const end = moment().endOf("month").toISOString();
				const res = await fetch(`/api/events?start=${start}&end=${end}`);
				if (!res.ok) throw new Error("Failed to fetch events");
				const { data } = await res.json();
				const calendarEvents: CalendarEvent[] = data.map(
					(event: EventType) => ({
						id: event.id,
						title: event.title,
						start: new Date(event.start),
						end: new Date(event.end),
						todo: event.todo,
					})
				);
				setEvents(calendarEvents);

				const todoRes = await fetch("/api/todos");
				if (!todoRes.ok) throw new Error("Failed to fetch todos");
				const { data: todoData } = await todoRes.json();
				setTodos(todoData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
		setNewEvent({ ...newEvent, start, end });
		setSelectedEvent(null);
		setIsModalOpen(true);
	};

	const handleSelectEvent = async (event: CalendarEvent) => {
		if (event.id.startsWith("todo-")) return; // Ignore todos for editing
		try {
			const res = await fetch(`/api/events/${event.id}`);
			if (!res.ok) throw new Error("Failed to fetch event");
			const eventData: EventType = await res.json();
			setSelectedEvent(eventData);
			setNewEvent({
				title: eventData.title,
				description: eventData.description,
				start: new Date(eventData.start),
				end: new Date(eventData.end),
				todo: eventData.todo || "",
			});
			setIsModalOpen(true);
		} catch (error) {
			console.error("Error fetching event:", error);
		}
	};

	const handleSaveEvent = async () => {
		try {
			const method = selectedEvent ? "PUT" : "POST";
			const url = selectedEvent
				? `/api/events/${selectedEvent.id}`
				: "/api/events";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newEvent),
			});
			if (!res.ok) throw new Error(`Failed to ${method.toLowerCase()} event`);
			const event: EventType = await res.json();
			setEvents((prev) =>
				selectedEvent
					? prev.map((e) =>
							e.id === event.id
								? {
										...e,
										...event,
										start: new Date(event.start),
										end: new Date(event.end),
								  }
								: e
					  )
					: [
							...prev,
							{
								id: event.id,
								title: event.title,
								start: new Date(event.start),
								end: new Date(event.end),
								todo: event.todo,
							},
					  ]
			);
			setIsModalOpen(false);
			setNewEvent({
				title: "",
				description: "",
				start: new Date(),
				end: new Date(),
				todo: "",
			});
			setSelectedEvent(null);
		} catch (error) {
			console.error("Error saving event:", error);
		}
	};

	const handleDeleteEvent = async () => {
		if (!selectedEvent) return;
		try {
			const res = await fetch(`/api/events/${selectedEvent.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to delete event");
			setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
			setIsModalOpen(false);
			setSelectedEvent(null);
		} catch (error) {
			console.error("Error deleting event:", error);
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Calendar
			</Typography>
			<CalendarView
				events={events}
				onSelectSlot={handleSelectSlot}
				onSelectEvent={handleSelectEvent}
			/>
			<EventModal
				open={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedEvent(null);
				}}
				event={newEvent}
				setEvent={setNewEvent}
				todos={todos}
				onSave={handleSaveEvent}
				onDelete={selectedEvent ? handleDeleteEvent : undefined}
			/>
		</Box>
	);
}
