const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require('../models/admin.js');
const OTP = require('../models/otp.js'); 

exports.signUp = async (req, res) => {
    if (!req.body.email || req.body.email === '') {
        res.json({
            message: "Please Enter your Email",
            status: false,
        });
    } else if (!req.body.password) {
        res.json({
            message: "Please Enter Password",
            status: false,
        });
    } else {
        // Check if the admin with the same email already exists
        const existingAdmin = await Admin.findOne({ email: req.body.email });

        if (existingAdmin) {
            res.json({
                message: "Admin Already Exists",
                status: false,
            });
        } else {
            let photo = '';
            if (req.file) {
                const { path } = req.file;
                photo = path;
            }

            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(req.body.password, salt);

            const { email, user_name } = req.body;

            // Create a new Admin document in MongoDB
            const newAdmin = new Admin({
                email,
                password: hashpassword,
                user_name,
                image: photo,
                created_at: new Date(),
                updated_at: new Date(),
            });

            try {
                const savedAdmin = await newAdmin.save();
                if (savedAdmin) {
                    const token = jwt.sign({ id: savedAdmin._id }, 'IhTRsIsUwMyHAmKsA', {
                        expiresIn: "7d",
                    });
                    res.json({
                        message: "Admin Added Successfully!",
                        status: true,
                        result: savedAdmin,
                        token: token,
                    });
                } else {
                    res.json({
                        message: "Try Again",
                        status: false,
                    });
                }
            } catch (error) {
                console.error(error);
                res.json({
                    message: "Try Again",
                    status: false,
                    error,
                });
            }
        }
    }
};

exports.signIn = async function (req, res) {
    // Find the admin with the given email
    const foundAdmin = await Admin.findOne({ email: req.body.email });

    if (!foundAdmin) {
        res.json({
            message: "Admin Not Found",
            status: false,
        });
    } else {
        if (bcrypt.compareSync(req.body.password, foundAdmin.password)) {
            const token = jwt.sign({ id: foundAdmin._id }, 'IhTRsIsUwMyHAmKsA', {
                expiresIn: "7d",
            });
            res.json({
                message: "Login Successful",
                status: true,
                result: foundAdmin,
                token,
            });
        } else {
            res.json({
                message: "Invalid Password",
                status: false,
            });
        }
    }
};

exports.GetAdminByID = async (req, res) => {
    try {
        const admin = await Admin.findById({_id:req.body.admin_id});
        if (!admin) {
            return res.json({
                message: "Admin Not Found",
                status: false,
            });
        }
        res.json({
            message: "Admin Details",
            status: true,
            result: admin,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: "Try Again",
            status: false,
            error,
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.json({
                message: "Admin Not Found",
                status: false,
            });
        }

        if (bcrypt.compareSync(currentPassword, admin.password)) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword, salt);
            admin.password = hashPassword;
            await admin.save();
            res.json({
                message: "Password Changed Successfully",
                status: true,
                results: admin,
            });
        } else {
            res.json({
                message: "Incorrect Password",
                status: false,
            });
        }
    } catch (error) {
        console.error(error);
        res.json({
            message: "Try Again",
            status: false,
            error,
        });
    }
};

exports.newPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = await OTP.findOne({ email, status: 'verified' });

        if (otp) {
            const admin = await Admin.findOne({ email });
            if (admin) {
                const salt = await bcrypt.genSalt(10);
                const hashpassword = await bcrypt.hash(req.body.password, salt);
                admin.password = hashpassword;
                await admin.save();
                await OTP.deleteOne({ _id: otp._id });
                res.json({
                    message: "Password changed",
                    status: true,
                    result: admin,
                });
            } else {
                // Handle if the user is not found
                res.json({
                    message: "User Not Found! Try Again",
                    status: true,
                });
            }
        } else {
            res.json({
                message: "Not Found Any OTP, First Verify Email then Change Password",
                status: false,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error occurred",
            success: false,
        });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        if (!req.body.admin_id) {
            return res.json({
                message: "admin_id is required",
                status: false,
            });
        }

        const admin = await Admin.findById({_id:req.body.admin_id});

        if (!admin) {
            return res.json({
                message: "Admin Not Found",
                status: false,
            });
        }

        const { email, user_name } = req.body;
        let photo = admin.image;

        if (req.file) {
            const { path } = req.file;
            photo = path;
        }

        admin.email = email || admin.email;
        admin.user_name = user_name || admin.user_name;
        admin.image = photo;
        admin.updated_at = new Date();

        const updatedAdmin = await admin.save();

        res.json({
            message: "Admin Updated Successfully!",
            status: true,
            result: updatedAdmin,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: "Try Again",
            status: false,
            error,
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const admin = await Admin.findById({_id:req.body.admin_id});

        if (!admin) {
            return res.json({
                message: "Admin Not Found",
                status: false,
            });
        }

        await admin.deleteOne();

        res.json({
            message: "Admin Deleted Successfully!",
            status: true,
            result: admin,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: "Try Again",
            status: false,
            error,
        });
    }
};

