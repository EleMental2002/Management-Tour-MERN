import React, { useState, useContext } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'

import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'

// import { AuthContext } from './../context/AuthContext'
import { BASE_URL } from './../utils/config'

const PasswordReset = () => {


    const [credentials, setCredentials] = useState({
        email: undefined,
    })

    // const { dispatch } = useContext(AuthContext)
    const navigate = useNavigate()


    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
    };

    const handleClick = async e => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/auth/resetpasswordlink`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // credentials: 'include',
                body: JSON.stringify(credentials),
            })

            const result = await res.json();
            console.log(result.message);
            if (result.success) {
                setCredentials({ email: '' });
                alert("Password reset link sent successfully.Check your mail!!!");
                navigate("/login");
            }
            else {
                alert("Invalid credentials")
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
                                <h2>Forgot Password</h2>

                                <Form onSubmit={handleClick}>
                                    <FormGroup>
                                        <input type="email" placeholder="Enter your registered email" required id="email" onChange={handleChange} value={credentials.email} />
                                    </FormGroup>
                                    <Button className='btn secondary__btn auth__btn' type="submit" >Send</Button>
                                </Form>
                                <div style={{ textAlign: 'center', color: 'white', padding: '5px' }}>OR</div>
                                <Button className='btn secondary__btn auth__btn' onClick={() => {
                                    navigate("/generate-otp")
                                }} >Login with OTP</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default PasswordReset