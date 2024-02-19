import React, { useState, useContext } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { ToastContainer, toast } from 'react-toastify';
import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'

import { AuthContext } from './../context/AuthContext'
import { BASE_URL } from './../utils/config'

const LoginOtp = () => {

    const location = useLocation()

    const [credentials, setCredentials] = useState({
        email: location.state,
        otp: undefined,
    })



    const { dispatch } = useContext(AuthContext)
    const navigate = useNavigate()



    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
    };

    const handleClick = async (e) => {
        e.preventDefault();

        dispatch({ type: 'LOGIN_START' })
        try {


            const res = await fetch(`${BASE_URL}/auth/loginotp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // credentials: 'include',
                body: JSON.stringify(credentials),
            })

            const result = await res.json();

            if (result.success) {
                setCredentials({ otp: '' });
                dispatch({ type: 'LOGIN_SUCCESS', payload: result.data })
                toast.success(result.message);
                setTimeout(() => {
                    navigate("/")
                }, 5000)
            }
            else if (credentials.otp.length < 6 && !result.success) {
                toast.error(result.errors[0].msg)
            }
            else {
                toast.error(result.error)
            }
        } catch (err) {
            dispatch({ type: 'LOGIN_FAILURE', payload: err.message })
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
                                        <input type="text" placeholder="Enter OTP" required id="otp" onChange={handleChange} value={credentials.otp} />
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

export default LoginOtp;