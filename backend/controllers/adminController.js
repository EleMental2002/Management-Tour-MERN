import Admin from "../models/Admin.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config();


//email config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {

        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

//admin registration
export const registration =
    [
        body("adminName", "Enter a valid name").isLength({ min: 3 }),
        // body("address").isString(),
        // body("locality").isString(),
        // body("pincode", "Must be of 6 digits").isNumeric().isLength({ min: 6, max: 6 }),
        body("email", "Enter a valid email").isEmail(),
        // body("phone", "Must be of 10 digits").isNumeric({ min: 10, max: 10 }),
        // body("gstnumber", "Enter a valid gstnumber").isString(),
        // body("tradelicense", "Enter a valid trade license number").isNumeric(),

        async (req, res) => {
            const { adminName, email } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ success: false, errors: errors.array() });
                return;
            }
            const userexists = await Admin.findOne({ email })
            if (userexists) {
                return res.status(404).json({ status: 404, success: false, message: 'User already exists' });
            }
            else {
                try {


                    const newAdmin = new Admin({
                        adminName: adminName,
                        email: email,

                    })

                    const regsuccess = await newAdmin.save();

                    if (regsuccess) {
                        const user = await Admin.findOne({ email })

                        res.status(200).json({ success: true, message: 'Successfully created' })
                        //if user doesn't exist
                        if (!user) {
                            return res.status(404).json({ success: false, message: 'User not found' });
                        } else {

                            const random = Math.floor(1000 + Math.random() * 9000);

                            const keypass = `@${adminName[0]}${adminName[adminName.length - 1].toUpperCase()}${random}#`
                            //hashing keypass
                            const salt = bcrypt.genSaltSync(10)
                            const hashkeypass = bcrypt.hashSync(keypass, salt);

                            const updatekeypass = await Admin.findByIdAndUpdate({ _id: user._id }, { keypass: hashkeypass }, { new: true })

                            // console.log(updatekeypass);

                            const mailOptions = {
                                from: process.env.EMAIL,
                                to: email,
                                subject: "Sending a unique key pass for your admin panel",
                                text: `This keypass : ${keypass} is unique and assigned only for your admin panel.Please do not share with others.`
                            }
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.error("error", error);
                                    res.status(401).json({ success: false, message: "email not send" })
                                } else {
                                    console.log("Email sent", info.response);
                                    res.status(201).json({ success: true, message: "Email sent successfully" })
                                }
                            })

                        }
                    }

                } catch (err) {
                    res.status(500).json({ success: false, message: 'Failed to create.Try again', error: err.message })
                }


            }

        }



    ];

//user login
export const login = [
    body("email", "Enter a valid email").isEmail(),
    body("keypass", "Keypass is required to login").notEmpty().isLength({ min: 8, max: 8 })
    , async (req, res) => {

        const { email, keypass } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }
        try {
            const user = await Admin.findOne({ email })


            //if user doesn't exist
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            //if user exists then check the keypass 
            const checkKeypass = await bcrypt.compare(keypass, user.keypass)

            //if keypass is incorrect
            if (!checkKeypass) {
                return res.status(401).json({ success: false, message: 'Incorrect email or keypass' })
            }
            else {
                const { hotels, tokens, keypass, role, ...rest } = user._doc

                //create jwt token
                const token = jwt.sign(
                    { id: user._id, role: user.role },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "15d" }
                )



                //set token in the browser cookies and send the response to the client
                res.cookie('adminToken', token, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 9000000),
                }).status(200).json({ token, data: { ...rest }, role })


            }





        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to login', error: error })
        }
    }];


