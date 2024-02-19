import User from "../models/User.js";
// import userOtp from "../models/userOtp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//email config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

//user registration
export const register = [
    body("username", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
        min: 6,
    }),
    body("cpassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Confirm Password must be same as password");
        }
        return true;
    }),
    async (req, res) => {
        const { username, email, password, cpassword, photo } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }
        try {
            //hashing password
            const salt = bcrypt.genSaltSync(10);
            const hashpassword = bcrypt.hashSync(password, salt);
            const hashcpassword = bcrypt.hashSync(cpassword, salt);

            const newUser = new User({
                username: username,
                email: email,
                password: hashpassword,
                cpassword: hashcpassword,
                photo: photo,
            });

            await newUser.save();

            res.status(200).json({ success: true, message: "Successfully created" });
        } catch (err) {
            res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to create.Try again",
                    error: err.message,
                });
        }
    },
];

//user login
export const login = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email });

        //if user doesn't exist
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        //if user exists then check the password or compare the password
        const checkCorrectPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        //if password is incorrect
        if (!checkCorrectPassword) {
            return res
                .status(401)
                .json({ success: false, message: "Incorrect email or password" });
        }

        const { password, cpassword, bookings, otps, role, ...rest } = user._doc;

        //create jwt token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15d" }
        );

        // Save the token in the user's document
        // user.tokens.push({ token });
        await user.save();

        //set token in the browser cookies and send the response to the client
        res
            .cookie("userToken", token, {
                expires: new Date(Date.now() + 9000000),
            })
            .status(200)
            .json({ token, data: { ...rest }, role });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to login", error: error });
    }
};

//send email link for reset password

export const resetpasswordlink = [
    body("email").isEmail().withMessage("Enter a valid email"),

    async (req, res) => {
        const { email } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        if (!email) {
            res.status(401).json({ success: false, message: "Enter your email" });
        }
        try {
            const userfind = await User.findOne({ email: email });
            const token = jwt.sign(
                { id: userfind._id, role: userfind.role },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "120s" }
            );

            const setusertoken = await User.findByIdAndUpdate(
                { _id: userfind._id },
                { verifytoken: token },
                { new: true }
            );

            if (userfind) {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending email for password reset",
                    text: `This link is valid only for 2 minutes http://localhost:3008/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("error", error);
                        res.status(401).json({ success: false, message: "email not send" });
                    } else {
                        console.log("Email sent", info.response);
                        res
                            .status(201)
                            .json({ success: true, message: "Email sent successfully" });
                    }
                });
            }
        } catch (err) {
            res
                .status(401)
                .json({ success: false, message: "Invalid user", error: err.message });
        }
    },
];

//verfiy user for forgot password
export const verifyuser = async (req, res) => {
    const { id, token } = req.params;
    try {
        const validuser = await User.findOne({ _id: id, verifytoken: token });
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (validuser && verifyToken.id) {
            res.status(201).json({ success: true, validuser });
        } else {
            res.status(401).json({ success: false, message: "User do not exist" });
        }
    } catch (err) {
        res.status(401).json({ status: 401, error: err });
    }
};

//change password
export const changepassword = [
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    async (req, res) => {
        const { id, token } = req.params;

        const { password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        try {
            const validuser = await User.findOne({ _id: id, verifytoken: token });
            console.log(validuser);
            const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(verifyToken);

            if (validuser && verifyToken.id) {
                const salt = bcrypt.genSaltSync(10);
                const newpassword = bcrypt.hashSync(password, salt);

                const setnewuserpass = await User.findByIdAndUpdate(
                    { _id: id },
                    { password: newpassword, cpassword: newpassword }
                );

                await setnewuserpass.save();
                res.status(201).json({ success: true, setnewuserpass });
            } else {
                res.status(401).json({ sucess: false, message: "user do not exist" });
            }
        } catch (err) {
            res.status(401).json({ status: 401, error: err });
        }
    },
];

//user send otp
export const userOtpSend = [
    body("email", "Enter a valid email").isEmail(),
    async (req, res) => {
        const { email } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        try {
            const preuser = await User.findOne({ email: email });
            if (preuser) {
                const OTP = Math.floor(100000 + Math.random() * 900000);

                const otp_expiry_duration = 2 * 60 * 1000;

                const expirationTime = new Date(Date.now() + otp_expiry_duration);

                // const existEmail = await userOtp.findOne({ email: email });

                // if (existEmail) {

                //     const updateData = await userOtp.findByIdAndUpdate(
                //         { _id: existEmail._id },
                //         { otp: OTP, expiresAt: expirationTime },
                //         { new: true }
                //     );

                //     await updateData.save();

                //     const mailOptions = {
                //         from: process.env.EMAIL,
                //         to: email,
                //         subject: "Sending Email For Otp Validation",
                //         text: `OTP :- ${OTP}
                //         This OTP will be outdated after 2 minutes`
                //     }
                //     transporter.sendMail(mailOptions, (error, info) => {
                //         if (error) {
                //             console.error("error", error);
                //             res.status(401).json({ success: false, message: "Failed to sent Otp", error })
                //         } else {
                //             console.log("Email sent", info.response);
                //             res.status(201).json({ success: true, message: "Otp sent successfully.Check your email!!" })
                //         }
                //     })

                // } else {

                //     const saveOtpData = new userOtp({
                //         email, otp: OTP, expiresAt: expirationTime
                //     })

                //     await saveOtpData.save();
                //     const mailOptions = {
                //         from: process.env.EMAIL,
                //         to: email,
                //         subject: "Sending Email for Otp Validation",
                //         text: `OTP :- ${OTP}
                //         This OTP will be outdated after 2 minutes`

                //     }

                //     transporter.sendMail(mailOptions, (error, info) => {
                //         if (error) {
                //             console.error("error", error);
                //             res.status(401).json({ success: false, message: "Failed to sent Otp" })
                //         } else {
                //             console.log("Email sent", info.response);
                //             res.status(201).json({ success: true, message: "Otp sent successfully.Check your email!!" })
                //         }
                //     })

                // }
                const updateData = await User.findByIdAndUpdate(
                    preuser._id,
                    {
                        $set: {
                            "otps.loginOtp": OTP,
                            "otps.expiresAt": expirationTime,
                        },
                    },
                    { new: true }
                );
                if (updateData) {
                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: email,
                        subject: "Sending Email For Otp Validation",
                        text: `OTP :- ${OTP}
                        This OTP will be outdated after 2 minutes`,
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error("error", error);
                            res
                                .status(401)
                                .json({ success: false, message: "Failed to sent Otp", error });
                        } else {
                            console.log("Email sent", info.response);
                            res
                                .status(201)
                                .json({
                                    success: true,
                                    message: "Otp sent successfully.Check your email!!",
                                });
                        }
                    });
                } else {
                    res.status(400).json({ error: "something went wrong" });
                }
            } else {
                res.status(400).json({ success: false, message: "Invalid User" });
            }
        } catch (err) {
            res.status(400).json({ error: "Invalid Credentials", err });
        }
    },
];

export const userLoginOtp = [
    body("otp", "Incorrect Otp").isLength({ min: 6 }),
    async (req, res) => {
        const { email, otp } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        try {
            const otpVerify = await User.findOne({ email: email });

            const currentTimeStamp = new Date();
            const otpExpirationTime = new Date(otpVerify.otps.expiresAt);

            if (otpVerify.otps.loginOtp === otp) {
                if (currentTimeStamp <= otpExpirationTime) {
                    const preuser = await User.findOne({ email: email });

                    //token generate
                    //create jwt token
                    const token = jwt.sign(
                        { id: preuser._id, role: preuser.role },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: "15d" }
                    );

                    const { password, cpassword, bookings, otps, role, ...rest } = preuser._doc;


                    //set token in the browser cookies and send the response to the client

                    res.cookie("accessToken", token, {
                        httpOnly: true,
                        expires: new Date(Date.now() + 9000000),
                    })
                        .status(200)
                        .json({
                            success: true,
                            token,
                            data: { ...rest },
                            role,
                            message: "LoggedIn Successfully",
                        });
                } else {
                    res.status(400).json({ success: false, error: "Otp has expired" });
                }
            } else {
                res.status(402).json({ success: false, error: "Invalid Otp" });
            }
        } catch (err) {
            res.status(400).json({ error: "Login Failed", err });
        }
    },
];
