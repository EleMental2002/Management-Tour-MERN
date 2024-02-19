import React, { useEffect, useState } from 'react';
import { BASE_URL } from "./../utils/config";

const BookingCard = ({ booking, updateBookingData }) => {

  const [bookingStatus, setBookingStatus] = useState(booking.status);

  const handleCancel = async (e) => {
    e.stopPropagation();
    try {

      const res = await fetch(`${BASE_URL}/booking/cancel/${booking._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const result = await res.json();
      // console.log(result);
      alert("Are you sure you want to cancel this booking?");
      setBookingStatus('Cancelled');

      updateBookingData(result.data);

    } catch (err) {
      alert(err.message);
    }
  }


  return (
    <div className="booking-card">
      <h3>Booking ID: {booking._id}</h3>
      <p>Check-In: {booking.checkIn}</p>
      <p>Check-Out: {booking.checkOut}</p>
      <p>Location: {booking.tourName}</p>
      <p>Guests: {booking.guestSize}</p>
      <div className="booking-status" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>Status: <span style={{ color: bookingStatus === 'Cancelled' ? 'red' : 'green', fontWeight: 'bold' }}>{bookingStatus}</span></p>
        {bookingStatus !== "Cancelled" && (
          <button style={{ color: "white", background: "black", borderRadius: "8px", padding: "5px 25px" }} onClick={handleCancel}>Cancel</button>
        )}
      </div>

    </div >
  );
};

export default BookingCard;
