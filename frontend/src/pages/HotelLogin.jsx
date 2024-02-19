import React, { useState, useContext } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import '../styles/login.css'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'

import { AdminAuthContext } from './../context/adminAuthContext'
import { BASE_URL } from './../utils/config'

const HotelLogin = () => {

  const location = useLocation()
  const [passShow, setPassShow] = useState(false);

  const [credentials, setCredentials] = useState({
    email: location.state || undefined,
    keypass: undefined
  })

  const { adminDispatch } = useContext(AdminAuthContext)
  const navigate = useNavigate()


  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
  };

  const handleClick = async e => {
    e.preventDefault();

    adminDispatch({ type: 'ADMIN_LOGIN_START' })

    try {

      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })

      const result = await res.json()
      console.log(result.data);
      // if (!res.ok) alert(result.message)



      adminDispatch({ type: 'ADMIN_LOGIN_SUCCESS', payload: result.data })
      navigate('/admin/')

    } catch (err) {
      // dispatch({ type: 'LOGIN_FAILURE', payload: err.message })
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
                <h2>Login</h2>
                {
                  location.state ? (<div style={{ textAlign: 'center', color: 'white', padding: '5px' }}>A keypass has been sent successfully to your registered email.</div>
                  ) : null
                }

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input type="email" placeholder="Email" required id="email" onChange={handleChange} value={credentials.email} />
                  </FormGroup>
                  <FormGroup>
                    <input type={!passShow ? "password" : "text"} placeholder="Keypass" required id="keypass" onChange={handleChange} />
                    <div className="showpass" onClick={() => setPassShow(!passShow)}>
                      {!passShow ? "Show" : "Hide"}
                    </div>
                  </FormGroup>
                  <Button className='btn secondary__btn auth__btn' type="submit" >Login</Button>
                </Form>
                <p>Don't have an account? <Link to='/hotel-registration'>Create</Link> </p>

              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section >
  )
}

export default HotelLogin;
