
const mongoose = require('mongoose');

// Define the schema for the Pole
const PoleSchema = new mongoose.Schema({
	question: {
		type: String,
	},
	image: {
		type: String,
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the Pole model
const Pole = mongoose.model('Pole', PoleSchema);

module.exports = Pole;
