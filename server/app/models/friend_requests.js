const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
	sender_id: {
		type: mongoose.Types.ObjectId, // Assuming ObjectId is used for user IDs
		required: true,
		ref: 'User', // Reference to the 'User' collection
	},
	receiver_id: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User', // Reference to the 'User' collection
	},
	status: {
		type: String,
		enum: ['pending', 'accepted', 'rejected'],
		default: 'pending',
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
