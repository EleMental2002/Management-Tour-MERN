import express from 'express';
import { updateUser, deleteUser, getSingleUser, getAllUser, getSingleUserBookings } from './../controllers/userController.js'
const router = express.Router();

import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

//update user
router.put('/:id', verifyUser, updateUser)

//delete tour
router.delete('/:id', verifyUser, deleteUser)

//get single user
router.get('/:id', getSingleUser)

//get single user with bookings
router.get('/bookings/:id',verifyUser, getSingleUserBookings)

//get all users
router.get('/', verifyAdmin, getAllUser)

export default router;