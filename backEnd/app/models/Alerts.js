
const mongoose = require('mongoose');

// Define the schema for the AlertSchema
const AlertSchema = new mongoose.Schema({
	alert_name: {
		type: String,
	},
	alert_image: {
		type: String
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the Alert model
const Alert = mongoose.model('Alert', AlertSchema);

module.exports = Alert;