import express from 'express';
import { register, login, resetpasswordlink, verifyuser, changepassword, userOtpSend, userLoginOtp } from './../controllers/authController.js'



const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/resetpasswordlink', resetpasswordlink)
router.get('/forgotpassword/:id/:token', verifyuser)
router.post('/:id/:token', changepassword)
router.post('/sendotp', userOtpSend)
router.post('/loginotp', userLoginOtp)





export default router