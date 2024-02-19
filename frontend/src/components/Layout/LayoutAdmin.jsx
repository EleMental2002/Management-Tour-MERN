import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import HeaderAdmin from "./../Header/HeaderAdmin";
import FooterAdmin from "./../Footer/FooterAdmin";
import RoutersAdmin from "../../router/RoutersAdmin";


const LayoutAdmin = () => {
    return (
        <>
            <HeaderAdmin />
            <RoutersAdmin />
            <FooterAdmin />

        </>
    );
};

export default LayoutAdmin;
