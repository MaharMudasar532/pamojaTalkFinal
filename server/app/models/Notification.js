
const mongoose = require('mongoose');

// Define the schema for the notifications
const NotificationSchema = new mongoose.Schema({
	sender_id: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	receiver_id: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	message: {
		type: String,
		required: true,
	},
	//for retriveing data!
	table_name: {
		type: String,
		required: true,
	},
	table_data_id: {
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

// Create the Notification model
const Notification = mongoose.model('notifications', NotificationSchema);

module.exports = Notification;