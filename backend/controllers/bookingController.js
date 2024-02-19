import User from '../models/User.js';
import Booking from '../models/Bookings.js'


// create new booking
export const createBooking = async (req, res) => {
    
    
    const newBooking = new Booking(req.body)
    try {
        const savedBooking = await newBooking.save();

        res.status(200).json({ success: true, message: 'Your tour is booked', data: savedBooking })

        const {userId } = savedBooking;
        //after creating a new review now update the reivews array of the tour
        await User.findByIdAndUpdate(userId, {
            $push: { bookings: savedBooking._id }
        })

    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
};

//get single booking
export const getBooking = async (req, res) => {
    const id = req.params.id
    try {
        const book = await Booking.find({ userId: id })


        res.status(200).json({ success: true, message: "Successful", data: book })
    } catch (err) {
        res.status(404).json({ success: false, message: 'Not found' })
    }
};

//get all booking
export const getAllBooking = async (req, res) => {

    try {
        const books = await Booking.find()

        res.status(200).json({ success: true, message: "Successful", data: books })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

//cancel a single booking
export const cancelBooking = async (req, res) => {
    const id = req.params.id
    try {
        const cancelBooks = await Booking.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true })

        res.status(200).json({ success: true, message: "Successful", data: cancelBooks })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}
