import express from 'express';
import { createTour, deleteTour, getAllTour, getSingleTour, updateTour, getTourBySearch, getFeaturedTour, getTourCount } from './../controllers/tourController.js'

import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

//create new tour
router.post('/',verifyAdmin, createTour)

//update tour
router.put('/:id', verifyAdmin, updateTour)

//delete tour
router.delete('/:id', verifyAdmin, deleteTour)

//get single tour
router.get('/:id', getSingleTour)

//get all tours
router.get('/', getAllTour)

//get tour by search
router.get('/search/getTourBySearch', getTourBySearch)

//get featured tours
router.get('/search/getFeaturedTours', getFeaturedTour)

//get tours count
router.get('/search/getTourCount', getTourCount)

export default router;