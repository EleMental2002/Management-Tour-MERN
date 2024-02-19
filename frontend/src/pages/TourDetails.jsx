// import React, { useEffect, useRef, useState, useContext } from 'react';
// import '../styles/tour-details.css';
// import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
// import { useParams } from 'react-router-dom';
// import calculateAvgRating from './../utils/avgRating';
// import avatar from '../assets/images/avatar.jpg';
// import Booking from '../components/Booking/Booking';
// import Newsletter from '../shared/Newsletter';
// import useFetch from './../hooks/useFetch';
// import { BASE_URL } from './../utils/config';
// import { AuthContext } from './../context/AuthContext';
// // Import the Carousel component from react-responsive-carousel
// import { Carousel } from 'react-responsive-carousel';
// // Import the CSS for the carousel
// import 'react-responsive-carousel/lib/styles/carousel.min.css';

// const TourDetails = () => {
//   const { id } = useParams();
//   const reviewMsgRef = useRef();
//   const { user } = useContext(AuthContext);
//   const [tour, setTour] = useState([]);

//   // Fetch data from the database
//   const handleFetch = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/tours/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const result = await res.json();
//       setTour(result.tour); // Provide a default empty object if data is undefined
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     handleFetch();
//   }, []);

//   const { reviews } = tour;

//   return (
//     <>
//       <div>
//         {reviews && reviews.length > 0 && reviews.map((booking, index) => (
//           <div key={index}>
//             <p>{booking.reviewText}</p>
//           </div>
//         ))}

//       </div>
//     </>
//   );
// };

// export default TourDetails;

import React, { useEffect, useRef, useState, useContext } from "react";
import "../styles/tour-details.css";
import { Container, Row, Col, Form, ListGroup } from "reactstrap";
import { useParams } from "react-router-dom";
// import tourData from '../assets/data/tours'
import calculateAvgRating from "./../utils/avgRating";
import Booking from "../components/Booking/Booking";
import Newsletter from "../shared/Newsletter";
import useFetch from "./../hooks/useFetch";
import { BASE_URL } from "./../utils/config";
import Avatar from "@mui/material/Avatar";

import { AuthContext } from "./../context/AuthContext";

import StarRating from "../utils/starRating";

const TourDetails = () => {
  const { id } = useParams();

  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState(0);
  const { user } = useContext(AuthContext);
  console.log(user);

  //fetch data from database

  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);

  //destructure properties form tour object
  const {
    photo,
    title,
    desc,
    price,
    address,
    reviews,
    city,
    distance,
    maxGroupSize,
  } = tour;
  const [reviewSubmits, setReviewSubmits] = useState(reviews || []);
  const [submit, setSubmit] = useState(false);

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  //format date
  const options = { day: "numeric", month: "long", year: "numeric" };

  // State to store the selected rating

  // Callback function to handle rating change
  const handleRatingChange = (value) => {
    setTourRating(value);
  };

  //submit request to the server
  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    try {
      if (!user || user === undefined || user === null) {
        alert("Please sign in ");
      }

      const reviewObj = {
        username: user?.username,
        email: user.email,
        reviewText,
        rating: tourRating,
      };
      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewObj),
      });

      const result = await res.json();
      if (!res.ok) return alert(result.message);

      setReviewSubmits([...reviews, reviewObj]);
      setSubmit(true);
      alert(result.message);
      reviewMsgRef.current.value = "";
      setTourRating(0);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  return (
    <>
      <section>
        <Container>
          {loading && <h4 className="text-center pt-5">Loading...........</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              <Col lg="8">
                <div className="tour__content">
                  <img src={photo} alt="" />

                  <div className="tour__info">
                    <h2>{title}</h2>

                    <div className="d-flex align-items-center gap-5">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "var(--secondary-color)" }}
                        ></i>
                        {avgRating === 0 ? null : avgRating}
                        {totalRating === 0 ? (
                          "Not rated"
                        ) : (
                          <span>
                            ({reviews !== undefined ? reviews.length : ""})
                          </span>
                        )}
                      </span>

                      <span>
                        <i className="ri-map-pin-user-fill"></i>
                        {address}
                      </span>
                    </div>
                    <div className="tour__extra-details">
                      <span>
                        <i className="ri-map-pin-2-line"></i>
                        {city}
                      </span>
                      <span>
                        <i className="ri-money-dollar-circle-line"></i>${price}{" "}
                        / per person
                      </span>
                      <span>
                        <i className="ri-map-pin-time-line"></i>
                        {distance} k/m
                      </span>
                      <span>
                        <i className="ri-group-line"></i>
                        {maxGroupSize} people
                      </span>
                    </div>
                    <h5>Description</h5>
                    <p>{desc}</p>
                  </div>
                  {/* ----------tour reviews section start --------------- */}
                  <div className="tour__reviews mt-4">
                    <h4>
                      Reviews ({reviews !== undefined ? reviews.length : ""}{" "}
                      reviews)
                    </h4>

                    <Form onSubmit={submitHandler}>
                      <div className="d-flex align-items-center gap-3 mb-4  ">
                        <StarRating onRatingChange={handleRatingChange} />
                      </div>

                      <div className="review__input">
                        <input
                          type="text"
                          ref={reviewMsgRef}
                          placeholder="share your thoughts"
                          required
                        />
                        <button
                          className="btn primary__btn text-white"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                    <ListGroup className="user__reviews">
                      {submit
                        ? reviewSubmits.length > 0 &&
                        reviewSubmits?.map((review, index) => (
                          <div className="review__item" key={index}>
                            <Avatar
                              style={{
                                background: "#739373",
                                fontWeight: "bold",
                                fontSize: "15px",
                                textTransform: "capitalize",
                              }}
                            >
                              {review.username[0]}
                            </Avatar>
                            <div className="w-100">
                              <div className="d-flex align-items-center justify-content-between">
                                <div>
                                  <h5>{review.username}</h5>
                                  <p>{review.email}</p>
                                  <p>
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString("en-US", options)}
                                  </p>
                                </div>
                                <span className="d-flex align-items-center">
                                  {review.rating}{" "}
                                  <i className="ri-star-s-fill"></i>
                                </span>
                              </div>
                              <h6>{review.reviewText}</h6>
                            </div>
                          </div>
                        ))
                        : reviews?.map((review, index) => (
                          <div className="review__item" key={index}>
                            <Avatar
                              style={{
                                background: "#739373",
                                fontWeight: "bold",
                                fontSize: "15px",
                                textTransform: "captilize",
                              }}
                            >
                              {review.username[0]}
                            </Avatar>
                            <div className="w-100">
                              <div className="d-flex align-items-center justify-content-between">
                                <div>
                                  <h5>{review.username}</h5>
                                  <p>{review.email}</p>
                                  <p>
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString("en-US", options)}
                                  </p>
                                </div>
                                <span className="d-flex align-items-center">
                                  {review.rating}{" "}
                                  <i className="ri-star-s-fill"></i>
                                </span>
                              </div>
                              <h6>{review.reviewText}</h6>
                            </div>
                          </div>
                        ))}
                    </ListGroup>
                  </div>
                  {/* ----------tour reviews section end --------------- */}
                </div>
              </Col>
              <Col lg="4">
                <Booking tour={tour} avgRating={avgRating} />
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default TourDetails;
