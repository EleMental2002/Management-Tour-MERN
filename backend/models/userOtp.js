import mongoose from "mongoose";


const userOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,

        default: () => new Date(Date.now() + 1 * 60 * 1000)
    }
})


export default mongoose.model("userotps", userOtpSchema);
