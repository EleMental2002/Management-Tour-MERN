import "./App.css";
import React from "react";
import Layout from "./components/Layout/Layout";
import LayoutAdmin from "./components/Layout/LayoutAdmin";
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Layout />} />
        <Route path="/admin/*" element={<LayoutAdmin />} />
      </Routes>
      {/* <Layout /> */}
    </>
  );

}

export default App;
