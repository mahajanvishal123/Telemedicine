import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Calender.css";

const Calendar = ({ doctorId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const properCase = (s) =>
    typeof s === "string" && s.length
      ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
      : s;

  const parseTo24h = (t) => {
    if (!t) return null;
    const str = String(t).trim();
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(str)) {
      const parts = str.split(":");
      const hh = parts[0].padStart(2, "0");
      const mm = parts[1] || "00";
      const ss = parts[2] || "00";
      return `${hh}:${mm}:${ss}`;
    }
    const m = str.match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])$/);
    if (m) {
      let h = parseInt(m[1], 10);
      const mm = (m[2] || "00").padStart(2, "0");
      const ampm = m[3].toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      const hh = String(h).padStart(2, "0");
      return `${hh}:${mm}:00`;
    }
    return null;
  };

  const buildStartIso = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const date = String(dateStr).slice(0, 10);
    const t24 = parseTo24h(timeStr);
    if (t24) return `${date}T${t24}`;
    return date;
  };

  const patientNameFrom = (obj) =>
    (obj?.patientId?.name || obj?.patient?.name || "").trim() || "Patient";

  const mapApiAppointmentToEvent = (a) => {
    const id = a?._id || `${a?.appointmentDate || ""}-${a?.appointmentTime || ""}-${Math.random()}`;
    const start = buildStartIso(a?.appointmentDate, a?.appointmentTime);

    return {
      id: String(id),
      title: "", // ✅ खाली — कैलेंडर पर कुछ न दिखे
      start: start || null,
      display: 'background', // ✅ यह महत्वपूर्ण है — इवेंट को बैकग्राउंड में दिखाएगा (बिना टेक्स्ट के)
      extendedProps: {
        raw: a,
        patient: patientNameFrom(a),
        status: properCase(String(a?.status || "Scheduled")),
      },
    };
  };

  const staticAppointments = [
    {
      _id: "1",
      patientId: { name: "Rahul Sharma" },
      appointmentDate: "2025-9-10",
      appointmentTime: "10:00 AM",
      endTime: "10:30 AM",
      status: "Scheduled",
      reason: "General Checkup",
      notes: "Patient has mild fever.",
    },
    {
      _id: "2",
      patientId: { name: "Priya Singh" },
      appointmentDate: "2025-08-10",
      appointmentTime: "11:30 AM",
      endTime: "12:00 PM",
      status: "Completed",
      reason: "Dental Cleaning",
    },
    {
      _id: "3",
      patientId: { name: "Amit Patel" },
      appointmentDate: "2025-08-12",
      appointmentTime: "03:00 PM",
      endTime: "03:45 PM",
      status: "Pending",
      reason: "Follow-up",
    },
    {
      _id: "4",
      patientId: { name: "Sneha Gupta" },
      appointmentDate: "2025-08-15",
      appointmentTime: "09:00 AM",
      endTime: "09:30 AM",
      status: "Cancelled",
      reason: "Skin Allergy",
      notes: "Rescheduled for next week.",
    },
    {
      _id: "5",
      patientId: { name: "Vikram Mehta" },
      appointmentDate: "2025-08-18",
      appointmentTime: "04:00 PM",
      endTime: "05:00 PM",
      status: "Scheduled",
      reason: "Annual Physical",
    },
  ];

  useEffect(() => {
    const mappedEvents = staticAppointments
      .map(mapApiAppointmentToEvent)
      .filter((ev) => !!ev.start);

    setEvents(mappedEvents);
  }, []);

  // ✅ अब इवेंट्स पर कुछ भी न दिखे — सिर्फ बैकग्राउंड हाइलाइट
  const renderEventContent = () => {
    return null; // कुछ भी रेंडर न करें
  };

  // ✅ अब इवेंट पर क्लिक करने पर कुछ न हो — हम डेट क्लिक पर ही डिटेल्स दिखाएंगे
  const handleEventClick = () => {
    // कुछ न करें
  };

  // ✅ डेट पर क्लिक करने पर — उस दिन के सभी पेशेंट्स दिखाएं
  const getAppointmentsByDate = (dateStr) => {
    return events
      .filter(event => {
        if (!event.start) return false;
        const eventDate = event.start.toISOString().split('T')[0];
        return eventDate === dateStr;
      })
      .map(event => event.extendedProps.raw);
  };

  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr;
    const appointments = getAppointmentsByDate(clickedDate);
    if (appointments.length > 0) {
      setSelectedAppointments(appointments);
      setSelectedDate(clickedDate);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointments([]);
    setSelectedDate(null);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="dashboard-heading mb-0">My Calendar</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              const mappedEvents = staticAppointments
                .map(mapApiAppointmentToEvent)
                .filter((ev) => !!ev.start);
              setEvents(mappedEvents);
            }}
            title="Refresh data"
          >
            <i className="fas fa-sync-alt me-1" />
            Refresh
          </button>
        </div>
      </div>

      {apiError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{apiError}</span>
          <button className="btn btn-sm btn-light" onClick={() => {}}>
            Retry
          </button>
        </div>
      )}

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
          eventContent={renderEventContent} // ✅ अब कुछ न दिखे
          eventClick={handleEventClick} // ✅ इवेंट पर क्लिक करने पर कुछ न हो
          dateClick={handleDateClick} // ✅ सिर्फ डेट पर क्लिक करने पर डिटेल्स खुले
          dayCellDidMount={(arg) => {
            const dateStr = arg.date.toISOString().split('T')[0];
            const hasAppointments = events.some(event => {
              if (!event.start) return false;
              const eventDate = event.start.toISOString().split('T')[0];
              return eventDate === dateStr;
            });

            if (hasAppointments) {
              // ✅ सिर्फ हाइलाइट — बिना बैज के, बिना हॉवर इवेंट के
              arg.el.style.backgroundColor = '#e3f2fd';
              arg.el.style.borderRadius = '4px';
            }
          }}
          height="700px"
          weekends={true}
          editable={false}
        />
      </div>

      {/* Appointment Details Modal — सिर्फ क्लिक पर खुले */}
      {showModal && selectedAppointments.length > 0 && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Appointments on {selectedDate}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {selectedAppointments.map((appt, index) => (
                  <div key={appt._id || index} className="border rounded p-3 mb-3 bg-light">
                    <div className="mb-2">
                      <strong>Patient:</strong> {patientNameFrom(appt)}
                    </div>
                    <div className="mb-2">
                      <strong>Date:</strong> {appt.appointmentDate}
                    </div>
                    <div className="mb-2">
                      <strong>Time:</strong> {appt.appointmentTime}
                      {appt.endTime && ` - ${appt.endTime}`}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong> {properCase(appt.status || "Scheduled")}
                    </div>
                    <div className="mb-2">
                      <strong>Reason:</strong> {appt.reason || "N/A"}
                    </div>
                    {appt.notes && (
                      <div className="mb-2">
                        <strong>Notes:</strong> {appt.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;