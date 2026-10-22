// filepath: components/BookingForm.tsx
"use client";

import { useState } from "react";
import { siteConfig } from "../config/site";

// We allow the form to start with a specific room already selected
export default function BookingForm({ initialRoomId = "" }: { initialRoomId?: string }) {
  const [roomId, setRoomId] = useState(initialRoomId);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [guestName, setGuestName] = useState("");
  const [error, setError] = useState("");

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Check if all fields are filled
    if (!roomId || !checkIn || !checkOut || !guestName) {
      setError("Please fill in all fields (Room, Check In, Check Out, Name).");
      return;
    }

    // 2. Validate dates
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (outDate <= inDate) {
      setError("Check Out date must be after Check In date.");
      return;
    }

    // 3. Find the selected room's name
    const selectedRoom = siteConfig.rooms.find(r => r.id === roomId);
    const roomName = selectedRoom ? selectedRoom.name : "a room";

    // 4. Create the WhatsApp message
    const message = `Hello ${siteConfig.shortName} team! 🏄‍♂️\n\nI would like to make a booking inquiry:\n\n👤 Name: ${guestName}\n🛏️ Room: ${roomName}\n📅 Check-in: ${checkIn}\n📅 Check-out: ${checkOut}\n👥 Guests: ${guests}\n\nIs this available? I understand payment is cash on arrival. Thank you!`;

    // 5. Open WhatsApp
    const whatsappNum = siteConfig.whatsappNumber;
    if (!whatsappNum) {
      alert("DEVELOPER WARNING: No WhatsApp number is set in config/site.ts! Add one to test this.");
      return;
    }

    // Encode the text so it safely works in a URL
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl mx-auto relative z-20 border border-gray-100">
      <h3 className="text-xl font-bold text-ocean-900 mb-4 hidden md:block">
        Book Your Surf Stay
      </h3>
      
      {/* Show Error Message if there is one */}
      {error && <div className="mb-4 text-red-600 text-sm font-semibold bg-red-50 p-3 rounded">{error}</div>}
      
      <form onSubmit={handleBooking} className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
        
        {/* Name Input */}
        <div className="flex-1 w-full min-w-[150px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
          <input 
            type="text" 
            placeholder="John Doe"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-turquoise-500" 
          />
        </div>

        {/* Room Selection */}
        <div className="flex-1 w-full min-w-[150px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Room Type</label>
          <select 
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-turquoise-500"
          >
            <option value="">Select a room...</option>
            {siteConfig.rooms.map((room) => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>

        {/* Check In */}
        <div className="flex-1 w-full min-w-[130px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Check In</label>
          <input 
            type="date" 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-turquoise-500" 
          />
        </div>

        {/* Check Out */}
        <div className="flex-1 w-full min-w-[130px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Check Out</label>
          <input 
            type="date" 
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-turquoise-500" 
          />
        </div>

        {/* Guests */}
        <div className="w-full md:w-24">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Guests</label>
          <input 
            type="number" 
            min="1" 
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-turquoise-500" 
          />
        </div>

        {/* Submit Button */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <button 
            type="submit" 
            className="w-full md:w-auto bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
          >
            Inquire Now
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-500 mt-4 text-center md:text-left">
        * No payment required now. Availability is confirmed manually by our team via WhatsApp.
      </p>
    </div>
  );
}