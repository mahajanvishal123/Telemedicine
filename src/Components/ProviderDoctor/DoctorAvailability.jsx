import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

const DoctorAvailability = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [slots, setSlots] = useState([]);

  const handleAddSlot = () => {
    if (date && time && day) {
      const newSlot = {
        id: Date.now(),
        date,
        time,
        day
      };
      setSlots([...slots, newSlot]);
      // Reset form
      setDate('');
      setTime('');
      setDay('');
    }
  };

  const handleDeleteSlot = (id) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
    'Friday', 'Saturday', 'Sunday'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Set Your Availability</h1>
          <p className="text-gray-600">Select the dates and times you're available for appointments</p>
        </div>

        {/* Add Slot Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Availability Slot</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
                <input
                  type="time"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5C1C] focus:border-[#FF5C1C]"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
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
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAddSlot}
              className="flex items-center bg-[#FF5C1C] hover:bg-[#E54A0C] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              <FaPlus className="mr-2" /> Add Slot
            </button>
          </div>
        </div>

        {/* Slots Display */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Availability Slots</h2>
          <span className="bg-orange-100 text-[#FF5C1C] text-sm font-medium px-3 py-1 rounded-full">
            {slots.length} {slots.length === 1 ? 'Slot' : 'Slots'} Added
          </span>
        </div>
        
        {slots.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FaCalendarAlt className="mx-auto text-5xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No availability slots added yet</h3>
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
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaCalendarAlt className="mr-2 text-[#FF5C1C]" />
                      <span>{slot.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2 text-[#FF5C1C]" />
                      <span>{slot.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Available
                    </span>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <FaTrash className="mr-1" /> Remove
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