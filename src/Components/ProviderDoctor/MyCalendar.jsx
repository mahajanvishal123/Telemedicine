import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Calender.css";

const Calendar = () => {
  const [events, setEvents] = useState([
    { id: "1", title: "Team Meeting", start: new Date() },
    { id: "2", title: "Doctor Appointment", start: "2025-09-05T10:30:00" },
    { id: "3", title: "Conference", start: "2025-09-08", end: "2025-09-10" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setSelectedTime(arg.date.toTimeString().split(' ')[0].substring(0, 5));
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setTitle("");
    setDescription("");
  };

  const handleSaveMeeting = () => {
    if (!title.trim()) {
      alert("Please enter a title for the meeting");
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: title,
      start: selectedDate + (selectedTime ? "T" + selectedTime : ""),
      description: description,
    };

    setEvents([...events, newEvent]);
    handleModalClose();
  };

  const renderEventContent = (eventInfo) => (
    <div className="event-content">
      <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
    </div>
  );

  return (
    <div className="calendar-container">
      <h2 className="mb-4 dashboard-heading">My Calendar</h2>
      
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          events={events}
          eventContent={renderEventContent}
          height="auto"
          dateClick={handleDateClick}
          selectable={true}
          weekends={true}
          editable={true}
        />
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Book a Meeting</h5>
                <button type="button" className="btn-close" onClick={handleModalClose}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={selectedDate} 
                    readOnly 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input 
                    type="time" 
                    className="form-control" 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Meeting Title*</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}                                                 
                    placeholder="Enter meeting title"
                  /> ``
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    placeholder="Meeting details (optional)"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveMeeting}>
                  Book Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default Calendar;