const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    images: [
        {
            url: String,
        },
    ],
    status: {
        type: String,
        enum: ['Sent', 'Delivered', 'Seen'],
        default: 'Sent',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Add other message-related fields as needed
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
