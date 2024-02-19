import express from 'express';
import { registration, login } from '../controllers/adminController.js'
import {verifyAdmin } from "../utils/verifyToken.js";



const router = express.Router();

router.post('/register', registration)
router.post('/login',login)



export default router