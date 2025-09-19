import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Calender.css";
import Base_Url from '../../Baseurl/Baseurl'; // path adjust kar lena


const Calendar = ({ doctorId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const bookedDatesRef = useRef(new Set());

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
    const status = properCase(String(a?.status || "Scheduled"));
    const startStr = buildStartIso(a?.appointmentDate, a?.appointmentTime);
    const title = "Appointment";
    const description = a?.reason || a?.notes || "";

    let end = undefined;
    if (a?.endTime) {
      const endIso = buildStartIso(a?.appointmentDate, a?.endTime);
      if (endIso) end = endIso;
    }

    const startDate = startStr ? new Date(startStr) : null;
    const endDate = end ? new Date(end) : null;

    return {
      id: String(id),
      title,
      start: startDate,
      end: endDate,
      extendedProps: {
        raw: a,
        status,
        description,
        patient: patientNameFrom(a),
      },
    };
  };

const fetchAppointments = async () => {
  setLoading(true);
  setApiError(null);

  try {
    const response = await axios.get(`${Base_Url}/appointment?doctorId=${doctorId}`);
    console.log("API Response:", response.data);

    const data = response.data.appointments || [];  // ✅ FIX HERE

    const mappedEvents = data
      .map(mapApiAppointmentToEvent)
      .filter((ev) => !!ev.start);

    setEvents(mappedEvents);

    const datesSet = new Set();
    mappedEvents.forEach((event) => {
      const dateStr = event.start instanceof Date
        ? event.start.toISOString().split("T")[0]
        : new Date(event.start).toISOString().split("T")[0];
      datesSet.add(dateStr);
    });
    bookedDatesRef.current = datesSet;
  } catch (error) {
    setApiError("Failed to load appointments.");
    console.error("API error:", error);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const renderEventContent = (eventInfo) => {
    return (
      <div className="fc-event-main">
        <span>{eventInfo.timeText}</span>
      </div>
    );
  };

  const handleEventClick = (info) => {
    setSelectedAppointments([info.event.extendedProps.raw]);
    setShowModal(true);
  };

  const getAppointmentsByDate = (dateStr) => {
    return events
      .filter((event) => {
        if (!event.start) return false;
        const eventDate = event.start instanceof Date
          ? event.start.toISOString().split("T")[0]
          : new Date(event.start).toISOString().split("T")[0];
        return eventDate === dateStr;
      })
      .map((event) => event.extendedProps.raw);
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
            onClick={fetchAppointments}
            title="Refresh data"
          >
            <i className="fas fa-sync-alt me-1" />
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="alert alert-info">Loading appointments...</div>
      )}

      {apiError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{apiError}</span>
          <button className="btn btn-sm btn-light" onClick={fetchAppointments}>
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
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          dayCellContent={(arg) => {
            const dateStr = arg.date.toISOString().split("T")[0];
            const isBooked = bookedDatesRef.current.has(dateStr);
            return (
              <div className="fc-daygrid-day-content d-flex flex-column align-items-center">
                <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
                {isBooked && (
                  <span className="badge bg-primary mt-1" style={{ fontSize: "0.65rem" }}>
                    Booked
                  </span>
                )}
              </div>
            );
          }}
          dayCellDidMount={(arg) => {
            const dateStr = arg.date.toISOString().split("T")[0];
            const hasAppointments = events.some((event) => {
              const eventDate = event.start instanceof Date
                ? event.start.toISOString().split("T")[0]
                : new Date(event.start).toISOString().split("T")[0];
              return eventDate === dateStr;
            });

            if (hasAppointments) {
              arg.el.style.backgroundColor = "#e3f2fd";
              arg.el.style.borderRadius = "4px";
              arg.el.style.cursor = "pointer";
            }
          }}
          height="700px"
          weekends={true}
          editable={false}
        />
      </div>

      {/* Appointment Modal */}
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
