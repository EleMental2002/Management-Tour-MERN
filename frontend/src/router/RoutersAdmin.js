import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminHome from "../pages/AdminHome";

const RoutersAdmin = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminHome />} />


        </Routes>
    );
};

export default RoutersAdmin;