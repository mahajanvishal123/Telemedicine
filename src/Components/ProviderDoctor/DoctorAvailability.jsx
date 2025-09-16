import React, { useEffect, useMemo, useState } from 'react';
import { FaCalendarAlt, FaClock, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import API_URL from '../../Baseurl/Baseurl'; // path adjust kar lena

const DoctorAvailability = () => {
  const BASE_URL = API_URL || '';

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [day, setDay] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [slots, setSlots] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  // ---------- Helpers (doctorId + token without hardcoding) ----------
  const safeJSON = (t) => { try { return JSON.parse(t); } catch { return null; } };

  const token = useMemo(() => {
    const storedUser = safeJSON(localStorage.getItem('user')) || {};
    return (
      localStorage.getItem('accessToken') ||
      storedUser?.token ||
      localStorage.getItem('token') ||
      ''
    );
  }, []);

  const doctorId = useMemo(() => {
    const u = safeJSON(localStorage.getItem('user')) || {};
    const d = safeJSON(localStorage.getItem('doctor')) || {};
    const profile = safeJSON(localStorage.getItem('profile')) || {};

    const direct =
      u?.doctor?._id ||
      u?.user?._id ||
      u?._id ||
      d?._id ||
      profile?._id;

    if (direct) return direct;

    // Fallback: decode JWT to find id if present
    if (token && token.split('.').length === 3) {
      try {
        const body = JSON.parse(atob(token.split('.')[1]));
        return body?.doctorId || body?.id || body?._id || body?.userId || '';
      } catch {
        return '';
      }
    }
    return '';
  }, [token]);

  // Set Authorization header if token available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday'
  ];
  const timesOfDay = ['Morning', 'Afternoon', 'Evening'];

  // ---------- Formatters ----------
  const to12h = (hhmm) => {
    if (!hhmm) return '';
    const [hStr, mStr] = hhmm.split(':');
    let h = parseInt(hStr, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${mStr} ${suffix}`;
  };

  const toISODateStart = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return '';
    return new Date(`${yyyy_mm_dd}T00:00:00.000Z`).toISOString();
  };

  const getDayName = (isoDateStr) => {
    const d = new Date(isoDateStr);
    return daysOfWeek[d.getUTCDay() === 0 ? 6 : d.getUTCDay() - 1] || '';
  };

  const formatDateYMD = (isoDateStr) => {
    const d = new Date(isoDateStr);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // ---------- GET slots by doctorId ----------
  const fetchSlots = async () => {
    if (!doctorId) return;
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${BASE_URL}/slot`, {
        params: { doctorId } // agar backend token se infer karta hai to is line ko hata sakte ho
      });
      const apiSlots = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const mapped = apiSlots.map((s) => ({
        id: s._id,
        date: formatDateYMD(s.date || s.createdAt || new Date().toISOString()),
        startTime: s.startTime,
        endTime: s.endTime,
        day: getDayName(s.date || s.createdAt || new Date().toISOString()),
        timeOfDay: s.slotType
      }));
      setSlots(mapped);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load slots'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  // ---------- POST create slot ----------
  const validateForm = () => {
    if (!date || !startTime || !endTime || !day || !timeOfDay) {
      alert('Please fill all fields.');
      return false;
    }
    const s = new Date(`1970-01-01T${startTime}:00`);
    const e = new Date(`1970-01-01T${endTime}:00`);
    if (!(e > s)) {
      alert('End time must be after start time.');
      return false;
    }
    if (!doctorId) {
      alert('Doctor ID not found. Please login as doctor.');
      return false;
    }
    return true;
  };

  const handleAddSlot = async () => {
    if (!validateForm()) return;

    const payload = {
      // remove doctorId if server reads from token:
      doctorId,
      date: toISODateStart(date),
      startTime: to12h(startTime),
      endTime: to12h(endTime),
      slotType: timeOfDay
    };

    try {
      setSubmitting(true);
      await axios.post(`${BASE_URL}/slot`, payload);
      await fetchSlots(); // server truth
      // Reset form
      setDate(''); setStartTime(''); setEndTime('');
      setDay(''); setTimeOfDay('');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to create slot';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- DELETE slot by id ----------
  const handleDeleteSlot = async (id) => {
    if (!id) return;
    const ok = window.confirm('Delete this slot?');
    if (!ok) return;

    try {
      setDeletingId(id);
      // Endpoint example: {{base_url}}/slot/68c90d0d65643b05e3f798b8
      await axios.delete(`${BASE_URL}/slot/${id}`);
      // Option A: local remove
      // setSlots((prev) => prev.filter((s) => s.id !== id));
      // Option B: canonical re-fetch (chosen)
      await fetchSlots();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete slot';
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Set Your Availability</h1>
          <p className="text-gray-600">Select the dates and times you're available for appointments</p>
          {!doctorId && (
            <p className="mt-2 text-sm text-red-600">
              Doctor ID not found — please login or store it in localStorage.
            </p>
          )}
        </div>

        {/* Add Slot Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Availability Slot</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5C1C] focus:border-[#FF5C1C]"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
                <input
                  type="time"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5C1C] focus:border-[#FF5C1C]"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
                <input
                  type="time"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5C1C] focus:border-[#FF5C1C]"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5C1C] focus:border-[#FF5C1C]"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="">Select Day</option>
                {daysOfWeek.map((dayOption) => (
                  <option key={dayOption} value={dayOption}>
                    {dayOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5C1C] focus:border-[#FF5C1C]"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
              >
                <option value="">Select Period</option>
                {timesOfDay.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddSlot}
              disabled={submitting || !doctorId}
              className="flex items-center bg-[#FF5C1C] hover:bg-[#E54A0C] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              <FaPlus className="mr-2" /> {submitting ? 'Saving...' : 'Add Slot'}
            </button>
          </div>
        </div>

        {/* Header row */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Availability Slots</h2>
          <span className="bg-orange-100 text-[#FF5C1C] text-sm font-medium px-3 py-1 rounded-full">
            {loading ? 'Loading…' : `${slots.length} ${slots.length === 1 ? 'Slot' : 'Slots'} Added`}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {/* Empty / List */}
        {!loading && slots.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FaCalendarAlt className="mx-auto text-5xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No availability slots found</h3>
            <p className="text-gray-500">Add your first slot using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <div key={slot.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-200">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-orange-100 text-[#FF5C1C] text-xs font-semibold px-2.5 py-0.5 rounded">
                      {slot.day}
                    </div>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      disabled={deletingId === slot.id}
                      className={`text-gray-400 hover:text-red-500 transition-colors ${deletingId === slot.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                      title="Delete"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaCalendarAlt className="mr-2 text-[#FF5C1C]" />
                      <span>{slot.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaClock className="mr-2 text-[#FF5C1C]" />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="inline-block w-3 h-3 rounded-full bg-[#FF5C1C] mr-2"></span>
                      <span>{slot.timeOfDay}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Available
                    </span>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      disabled={deletingId === slot.id}
                      className={`flex items-center text-red-600 hover:text-red-800 text-sm font-medium ${deletingId === slot.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <FaTrash className="mr-1" />
                      {deletingId === slot.id ? 'Deleting…' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAvailability;