import Subscriber from "../models/Subscribe.js";
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


//register subscriber
export const register =
    [
        body("email", "Enter a valid email").isEmail(),
        async (req, res) => {
            const { email } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ success: false, errors: errors.array() });
                return;
            }

            const userexists = await Subscriber.findOne({ email })
            if (userexists) {
                return res.status(404).json({ status: 404, success: false, message: 'You are already subscribed' });

            }
            else {
                try {

                    const newSubscriber = new Subscriber({
                        email: email,
                    })

                    await newSubscriber.save()

                    res.status(200).json({ success: true, message: 'Successfully created' })

                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: email,
                        subject: "Sending a sucesss msg for subscription",
                        text: `Congrats!!!! 😁 You are now subscribed.`
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

                } catch (err) {
                    res.status(500).json({ success: false, message: 'Failed to create.Try again', error: err.message })
                }

            }

        }
    ];
