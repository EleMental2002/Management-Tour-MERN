import express from 'express';

import { createBooking, getBooking, getAllBooking, cancelBooking } from '../controllers/bookingController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/create/:id', verifyUser, createBooking);
router.get('/:id', getBooking);
router.get('/', verifyAdmin, getAllBooking);
router.post('/cancel/:id', cancelBooking);

export default router