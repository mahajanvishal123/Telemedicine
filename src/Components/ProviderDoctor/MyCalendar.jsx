import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import "./Calender.css"

const events = [
  { title: "Team Meeting", start: new Date() },
  { title: "Doctor Appointment", start: "2025-09-05T10:30:00" },
  { title: "Conference", start: "2025-09-08", end: "2025-09-10" },
];

export default function MyCalendar() {
  return (
    <div>
      <h2 className="mb-4">My Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={events}
        eventContent={(eventInfo) => (
          <div>
            <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
          </div>
        )}
        height="auto"
      />
    </div>
  );
}
