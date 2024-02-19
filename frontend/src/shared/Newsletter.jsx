import React, { useRef } from "react";
import "./newsletter.css";
import { Container, Row, Col } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import { BASE_URL } from './../utils/config'

const Newsletter = () => {

  const emailRef = useRef("");



  const handleClick = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;

    if (!email) {
      toast.info("Please enter an email")
    }

    console.log(email);
    try {

      const res = await fetch(`${BASE_URL}/subscriber/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const result = await res.json();
      emailRef.current.value = ''

      console.log(result);
      if (result.success) {
        toast.success("Subscription added")
      }
      else {
        toast.error(result.message);
      }



    } catch (err) {
      console.log(err);
    }

  }


  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter__content">
              <h2>Subscribe now to get useful traveling information.</h2>

              <div className="newsletter__input">
                <input type="email" placeholder="Enter your email" name='email' ref={emailRef} />
                <button className="btn newsletter__btn" onClick={handleClick}>Subscribe</button>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
                aliquam, quo ut culpa perferendis recusandae!
              </p>
            </div>
          </Col>
          <Col lg="6">
            <div className="newsletter__map">
              <iframe
                title="Google Maps"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d905185.8365353525!2d87.80596683525809!3d27.597182358964616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6a56a5805eafb%3A0xa4c4b857c39b5a04!2sSikkim!5e0!3m2!1sen!2sin!4v1693391280621!5m2!1sen!2sin"
                allowFullScreen
              />
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </section>
  );
};

export default Newsletter;
