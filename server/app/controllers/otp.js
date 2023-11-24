
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");;
const emailOTPBody = require("../utils/emailOTPBody")
const Admin = require('../models/Admin');
const OTP = require('../models/Otp');
const User = require('../models/User'); 

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'ihteshamm112@gmail.com',
        pass: 'fzcnqvtxfzxarjxr',
    },
});

const sendOTPVerificationEmail = async (email, res) => {
    try {
        if (!email || email === '') {
            res.json({
                message: "Please Enter your Email",
                status: false,
            });
        } else {
            let result;
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
            console.log(otp);

            // Check if an OTP document exists for the given email
            const foundStoredOtp = await OTP.findOne({ email });

            if (!foundStoredOtp) {
                // If no OTP document exists, create one
                const newOtp = new OTP({
                    email,
                    otp,
                    status: 'pending',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                result = await newOtp.save();
            } else {
                // If an OTP document already exists, update it with a new OTP
                foundStoredOtp.otp = otp;
                foundStoredOtp.updatedAt = new Date();
                result = await foundStoredOtp.save();
            }

            // Send the OTP verification email
            let sendEmailResponse = await transporter.sendMail({
                from: 'verification@PAMOJA.com',
                to: email,
                subject: 'Verify Account',
                html: emailOTPBody(otp, "PAMOJA", "#746C70")
            });

            console.log(sendEmailResponse);

            if (sendEmailResponse.accepted.length > 0) {
                res.status(200).json({
                    message: `Sent a verification email to ${email}`,
                    success: true,
                    data: result,
                });
            } else {
                res.status(404).json({
                    message: `Could not send email`,
                    success: false,
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: `Internal server error occurred`,
            success: false,
        });
    }
};


exports.VerifyEmail = async (req, res) => {
    try {
        const email = req.body.email;

        // Check if the email exists in the User collection
        const user = await User.findOne({ email });

        if (user) {
            sendOTPVerificationEmail(user.email, res);
        } else {
            // If not found in User collection, check in the Admin collection
            const admin = await Admin.findOne({ email });

            if (admin) {
                sendOTPVerificationEmail(admin.email, res);
            } else {
                res.json({
                    message: "This email is not registered with this app, please add a valid email",
                    status: false
                });
            }
        }
    } catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        // Check if the OTP document exists for the given email and OTP
        const otpDoc = await OTP.findOne({ email, otp });

        if (otpDoc) {
            // Update the OTP document status to 'verified'
            otpDoc.status = 'verified';
            await otpDoc.save();

            res.json({
                message: "OTP verified",
                status: true,
                result: otpDoc
            });
        } else {
            res.json({
                message: "Incorrect OTP",
                status: false
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error occurred",
            success: false,
        });
    }
};
