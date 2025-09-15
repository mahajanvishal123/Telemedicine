import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../Baseurl/Baseurl";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Calender.css";

const Calendar = () => {
  const BASE_URL = API_URL;
  const DOCTOR_ID = "68c56a43d833a205bfd4237f";

  // Calendar events (API + locally added via modal)
  const [events, setEvents] = useState([]);

  // UI / API states
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ---------- Helpers ----------
  const properCase = (s) =>
    typeof s === "string" && s.length
      ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
      : s;

  const parseTo24h = (t) => {
    if (!t) return null;
    const str = String(t).trim();
    // already 24h "HH:mm" or "HH:mm:ss"
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(str)) {
      const parts = str.split(":");
      const hh = parts[0].padStart(2, "0");
      const mm = parts[1] || "00";
      const ss = parts[2] || "00";
      return `${hh}:${mm}:${ss}`;
    }
    // 12h like "10:30 AM" / "7 PM"
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
    return null; // unknown format
  };

  const buildStartIso = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const date = String(dateStr).slice(0, 10); // YYYY-MM-DD if ISO-ish
    const t24 = parseTo24h(timeStr);
    if (t24) return `${date}T${t24}`;
    // fallback just the date
    return date;
  };

  const patientNameFrom = (obj) =>
    (obj?.patientId?.name || obj?.patient?.name || "").trim() || "Patient";

  // Map API appointment -> FullCalendar event
  const mapApiAppointmentToEvent = (a) => {
    const id = a?._id || `${a?.appointmentDate || ""}-${a?.appointmentTime || ""}-${Math.random()}`;
    const status = properCase(String(a?.status || "Scheduled"));
    const start = buildStartIso(a?.appointmentDate, a?.appointmentTime);
    const title =
      (a?.title && a.title.trim()) ||
      `Appt: ${patientNameFrom(a)}${status ? ` (${status})` : ""}`;
    const description = a?.reason || a?.notes || "";

    // Optional end handling if backend sends duration
    let end = undefined;
    if (a?.endTime) {
      const endIso = buildStartIso(a?.appointmentDate, a?.endTime);
      if (endIso) end = endIso;
    }

    return {
      id: String(id),
      title,
      start: start || null,
      end: end || undefined,
      extendedProps: {
        raw: a,
        status,
        description,
        patient: patientNameFrom(a),
      },
    };
  };

  // ---------- API: GET appointments ----------
  const fetchAppointments = async () => {
    setLoading(true);
    setApiError(null);
    try {
      // You can send the doctorId via params (safer than string concat)
      const res = await axios.get(`${BASE_URL}/appointment`, {
        params: { doctorId: DOCTOR_ID },
      });

      const rawList = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      const apiEvents = rawList
        .map(mapApiAppointmentToEvent)
        .filter((ev) => !!ev.start); // keep only valid dates

      // If you also want to keep any local events already added, merge them smartly:
      setEvents((prev) => {
        const prevLocal = prev.filter((e) => !e.extendedProps?.raw); // previously added local meetings
        return [...apiEvents, ...prevLocal];
      });
    } catch (err) {
      console.error(err);
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Calendar handlers ----------
  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    const t = arg.date.toTimeString().split(" ")[0].substring(0, 5); // HH:mm
    setSelectedTime(t);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setTitle("");
    setDescription("");
  };

  // Local add (no POST requested) – stays in state only
  const handleSaveMeeting = () => {
    if (!title.trim()) {
      alert("Please enter a title for the meeting");
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      start: selectedDate + (selectedTime ? "T" + selectedTime : ""),
      extendedProps: {
        description: description,
        local: true,
      },
    };

    setEvents((prev) => [...prev, newEvent]);
    handleModalClose();
  };

  const renderEventContent = (eventInfo) => (
    <div className="event-content">
      <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
    </div>
  );

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="dashboard-heading mb-0">My Calendar</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={fetchAppointments}
            disabled={loading}
            title="Refresh from server"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                Loading…
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt me-1" />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

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
          height="auto"
          dateClick={handleDateClick}
          selectable={true}
          weekends={true}
          editable={true}
        />
      </div>

      {/* Booking Modal (local add only) */}
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
                  />
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
