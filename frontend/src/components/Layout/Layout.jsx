import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./../Header/Header";
import Footer from "./../Footer/Footer";
import Routers from "../../router/Routers";


const Layout = () => {
  return (
    <>
      <Header />
      <Routers />
      <Footer />

    </>
  );
};

export default Layout;
