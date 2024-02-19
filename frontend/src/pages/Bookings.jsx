import React, { useState, useContext, useEffect } from "react";
import BookingCard from "./BookingCard";
import "../styles/Bookings.css";
import { AuthContext } from './../context/AuthContext'
import { BASE_URL } from "./../utils/config";


const MyBookings = () => {


  const [bookingData, setBookingData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const { user } = useContext(AuthContext);


  const updateBookingData = (updatedBooking) => {

    const updatedIndex = bookingData.findIndex((booking) => booking._id === updatedBooking._id);
    if (updatedIndex !== -1) {
      const updatedBookingData = [...bookingData];
      updatedBookingData[updatedIndex] = updatedBooking;
      setBookingData(updatedBookingData);
    }
  };


  const handleBookings = async () => {


    try {
      if (!user || user === undefined || user === null) {
        return alert("Please sign in");
      }

      // const res = await fetch(`${BASE_URL}/booking/${user._id}`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   }
      // });
      const res = await fetch(`${BASE_URL}/users/bookings/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });

      const result = await res.json();
      // // console.log(result);
      // // const reversedData = [...result.data].reverse();
      // // setBookingData(reversedData);
      // setBookingData(result.data);

      if (result && result.data && Array.isArray(result.data)) {
        setBookingData(result.data);
      } else {
        setBookingData([]); // Set an empty array as a fallback
      }




    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    handleBookings();


    const intervalId = setInterval(() => {
      handleBookings();
    }, 1000);


    return () => clearInterval(intervalId);

  }, [])



  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setIsPopupOpen(true); // Open the popup
  };

  const closePopup = () => {
    setSelectedBooking(null);
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <div className="my-bookings-container">
      <h2 className="my-bookings-header">My Bookings</h2>
      <div
        className={`booking-list ${isPopupOpen ? "blurred-background" : ""}`}
      >
        {bookingData.map((booking, index) => (
          <div
            key={index}
            className="booking-card"
            onClick={() => handleBookingClick(booking)}
          >
            <BookingCard booking={booking} updateBookingData={updateBookingData} />
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Booking Details</h2>
            <p>
              <strong>Booking ID:</strong> {selectedBooking._id}
            </p>
            <p>
              <strong>Username:</strong> {selectedBooking.fullName}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.userEmail}
            </p>
            <p>
              <strong>Tour:</strong> {selectedBooking.tourName}
            </p>
            <p>
              <strong>Guests:</strong> {selectedBooking.guestSize}
            </p>
            <p>
              <strong>Check-In:</strong> {selectedBooking.checkIn}
            </p>
            <p>
              <strong>Check-In:</strong> {selectedBooking.checkOut}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>

            <button className="close-button" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
