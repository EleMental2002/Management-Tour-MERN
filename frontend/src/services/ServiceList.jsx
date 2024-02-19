import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";

import weatherImg from "../assets/images/weather.png";
import guideImg from "../assets/images/guide.png";
import customizationImg from "../assets/images/customization.png";
import customer from "../assets/images/customer.png";

const servicesData = [
  {
    imgUrl: weatherImg,
    title: "Local Experience Recommendations",
    desc: "Discover Sikkim's best-kept secrets and cultural gems for an unforgettable stay.",
  },
  {
    imgUrl: guideImg,
    title: "Hotel Options for every Budget",
    desc: "From budget-friendly to luxury resorts, find your ideal stay with us.",
  },
  {
    imgUrl: customizationImg,
    title: "Environmental Initiatives",
    desc: "Experience eco-friendly accommodations that harmonize with Sikkim's nature.",
  },
  {
    imgUrl: customer,
    title: "Responsive Customer Support",
    desc: "Round-the-Clock Support for Seamless Booking Experience",
  },
];

const ServiceList = () => {
  return (
    <>
      {servicesData.map((item, index) => (
        <Col lg="3" md="6" sm="12" className="mb-4" key={index}>
          <ServiceCard item={item} />
        </Col>
      ))}
    </>
  );
};

export default ServiceList;
