import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cpassword: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
    },

    role: {
      type: String,
      default: "user",
    },
    bookings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
      },
    ],
      otps: {
        loginOtp: {
          type: String,
      
        },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 1 * 60 * 1000)
    }
      },
  
    verifytoken: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
