import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import { Link, useParams, useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { ToastContainer, toast } from 'react-toastify';
import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'

// import { AuthContext } from './../context/AuthContext'
import { BASE_URL } from './../utils/config'

const ForgotPassword = () => {

    const [passShow, setPassShow] = useState(false);

    const [credentials, setCredentials] = useState({
        email: undefined,
        password: undefined
    })

    const { id, token } = useParams();

    // const { dispatch } = useContext(AuthContext)
    const navigate = useNavigate()

    const userValid = async () => {

        const res = await fetch(`${BASE_URL}/auth/forgotpassword/${id}/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()
        console.log(data);
        if (data.success) {
            toast.success("User Valid");

        } else {
            toast.error("Invalid User")

        }
    }


    const handleChange = e => {

        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))


    };

    const handleClick = async e => {
        e.preventDefault();


        try {

            const res = await fetch(`${BASE_URL}/auth/${id}/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // credentials: 'include',
                body: JSON.stringify(credentials),
            })

            const result = await res.json()
            console.log(result);
            if (result.success) {
                setCredentials({ password: '' })
                toast.success("Password Reset Successfully!!")
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            }
        } catch (error) {
            console.log(result.message, error);
        }
    }

    useEffect(() => {
        userValid()
    }, []);

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
                                <h2>Reset Password</h2>

                                <Form onSubmit={handleClick}>

                                    <FormGroup>
                                        <input type={!passShow ? "password" : "text"} placeholder="Enter New Password" required id="password" onChange={handleChange} />
                                        <div className="showpass" onClick={() => setPassShow(!passShow)}>
                                            {!passShow ? "Show" : "Hide"}
                                        </div>
                                    </FormGroup>
                                    <Button className='btn secondary__btn auth__btn' type="submit" >Reset</Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
                <ToastContainer />
            </Container>
        </section >
    );
};

export default ForgotPassword;


