import React, { useState, useContext } from "react";
import "./booking.css";
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from "reactstrap";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";

import DatePicker from "react-datepicker"; // Import the date picker library
import "react-datepicker/dist/react-datepicker.css";

const Booking = ({ tour, avgRating }) => {
  const { price, reviews, title, _id } = tour;

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState({
    userId: user && user._id,
    userEmail: user && user.email,
    tourId: _id,
    tourName: title,
    fullName: "",
    phone: "",
    guestSize: 1,
    checkIn: null,
    checkOut: null,
  });

  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Handle check-in date change
  const handleCheckInDateChange = (date) => {
    setBooking((prev) => ({ ...prev, checkIn: date }));
  };

  // Handle check-out date change
  const handleCheckOutDateChange = (date) => {
    setBooking((prev) => ({ ...prev, checkOut: date }));
  };

  // send data to the server
  const handleClick = async (e) => {
    e.preventDefault();

    console.log(booking);

    try {
      if (!user || user === undefined || user === null) {
        return alert("Please sign in");
      }

      const res = await fetch(`${BASE_URL}/booking/create/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(booking),
      });

      const result = await res.json();

      if (!res.ok) {
        return alert("got it");
      }
      navigate("/thank-you");
    } catch (err) {
      alert(err.message);
    }
  };
  const serviceFee = 10;
  const totalAmount =
    Number(price) * Number(booking.guestSize) + Number(serviceFee);

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ${price} <span>/per person</span>
        </h3>
        <span className="tour__rating d-flex align-items-center ">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>
      {/*------------- booking form start -------- */}
      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          <FormGroup>
            <input
              type="text"
              placeholder="Full name"
              id="fullName"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <input
              type="number"
              placeholder="Phone"
              id="phone"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3 flex-grow">

            <div style={{ flex: 1 }}>
              <DatePicker
                selected={booking.checkIn}
                onChange={handleCheckInDateChange}
                placeholderText="Check-In"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                required
              />
            </div>


            <div style={{ flex: 1 }}>
              <DatePicker
                selected={booking.checkOut}
                onChange={handleCheckOutDateChange}
                placeholderText="Check-Out"
                dateFormat="dd/MM/yyyy"
                minDate={booking.checkIn || new Date()}
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <input
                type="number"
                placeholder="Guest"
                id="guestSize"
                required
                onChange={handleChange}
              />
            </div>
          </FormGroup>
        </Form>
      </div>
      {/*------------- booking form end -------- */}

      {/* -------------booking bottom----------------- */}
      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              {price} <i className="ri-close-line"></i> 1 person
            </h5>
            <span>${price}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Service charge</h5>
            <span>${serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>${totalAmount}</span>
          </ListGroupItem>
        </ListGroup>

        <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default Booking;
