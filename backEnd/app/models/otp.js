
    const mongoose = require('mongoose');

    // Define the schema for the Otp
    const OtpSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        created_at: {
            type: String
        },
        updated_at: {
            type: String
        },
    });
    
    // Create the Otp model
    const Otp = mongoose.model('Otp', OtpSchema);
    
    module.exports = Otp;