import React, { useState, useContext } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { ToastContainer, toast } from 'react-toastify';
import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'


import { BASE_URL } from './../utils/config'

const OtpGeneration = () => {


    const [credentials, setCredentials] = useState({
        email: undefined,
    })


    const navigate = useNavigate()


    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/auth/sendotp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(credentials),
            })

            const result = await res.json();
            // console.log(result.message);
            if (result.success) {
                console.log(result);
                setCredentials({ email: '' });
                toast.success(result.message);
                setTimeout(() => {
                    navigate("/login-otp", { state: credentials.email })
                }, 5000)

            }
            else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log(result.message, error);
        }

    }


    return (
        <section>
            <Container>
                <Row>
                    <Col lg='8' className='m-auto'>
                        <div className="login__container d-flex justify-content-between">
                            <div className="login__img">
                                <img src={loginImg} alt="" />
                            </div>

                            <div className="login__form">
                                <div className="user">
                                    <img src={userIcon} alt="" />
                                </div>

                                <Form onSubmit={handleClick}>
                                    <FormGroup>
                                        <input type="email" placeholder="Enter your registered email" required id="email" onChange={handleChange} value={credentials.email} />
                                    </FormGroup>
                                    <Button className='btn secondary__btn auth__btn' type="submit" >Send</Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
                <ToastContainer />
            </Container>
        </section>
    )
}

export default OtpGeneration