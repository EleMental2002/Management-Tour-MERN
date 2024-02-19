import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        adminName: {
            type: String,
            required: true,
            unique: true,
        },
        // address: {
        //     type: String,
        //     required: true,
        // },
        // locality: {
        //     type: String,
        //     required: true,
        // },
        // pincode: {
        //     type: Number,
        //     required: true,
        // },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        // phone: {
        //     type: Number,
        //     required: true,
        //     unique: true
        // },
        // gstnumber: {
        //     type: String,
        //     required: true,
        //     unique: true
        // },
        // tradelicense: {
        //     type: String,
        //     required: true,
        //     unique: true
        // },
        keypass: {
            type: String,
        },
        role: {
            type: String,
            default: "admin",
        },
        hotels: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Tour",
            },
        ],
        verifytoken: {
            type: String,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Admins", adminSchema);