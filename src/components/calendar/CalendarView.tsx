import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	todo?: string;
}

interface CalendarViewProps {
	events: CalendarEvent[];
	onSelectSlot: (slot: { start: Date; end: Date }) => void;
	onSelectEvent: (event: CalendarEvent) => void;
}

const localizer = momentLocalizer(moment);

export default function CalendarView({
	events,
	onSelectSlot,
	onSelectEvent,
}: CalendarViewProps) {
	return (
		<Calendar
			localizer={localizer}
			events={events}
			startAccessor="start"
			endAccessor="end"
			style={{ height: 600 }}
			selectable
			onSelectSlot={onSelectSlot}
			onSelectEvent={onSelectEvent}
			defaultView="month"
			eventPropGetter={(event) => ({
				style: {
					backgroundColor: event.todo ? "#ffcc80" : "#3f51b5",
					color: "white",
				},
			})}
		/>
	);
}
