import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetails from "../pages/TourDetails";
import Login from "../pages/Login";
import PasswordReset from "../pages/PasswordReset";
import ForgotPassword from "../pages/ForgotPassword";
import Register from "../pages/Register";
import SearchResultList from "../pages/SearchResultList";
import ThankYou from "../pages/ThankYou";
import Adventure from "../pages/Adventure";
import HotelRegistration from "../pages/HotelRegistration";
import HotelLogin from "../pages/HotelLogin";
import OtpGeneration from "../pages/OtpGeneration";
import LoginOtp from "../pages/LoginOtp";
import MyBookings from "../pages/Bookings";
import BookingCard from "../pages/BookingCard";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/hotel-registration" element={<HotelRegistration />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
      <Route path="/generate-otp" element={<OtpGeneration />} />
      <Route path="/login-otp" element={<LoginOtp />} />
      <Route path="/register" element={<Register />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/hotel-login" element={<HotelLogin />} />
      <Route path="/adventure" element={<Adventure />} />
      <Route path="/bookingcard" element={<BookingCard />} />
      <Route path="/bookings" element={<MyBookings />} />
    </Routes>
  );
};

export default Routers;
