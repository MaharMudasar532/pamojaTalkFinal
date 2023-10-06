const mongoose = require('mongoose');

// Define the schema for the friend_requests
const friend_requestsSchema = new mongoose.Schema({
	sender_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	receiver_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	status: {
		type: String,
		default: 'pending'
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the friend_requests model
const friend_requests = mongoose.model('friend_requests', friend_requestsSchema);

module.exports = friend_requests;