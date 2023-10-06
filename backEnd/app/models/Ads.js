
const mongoose = require('mongoose');

// Define the schema for the Ads
const AdsSchema = new mongoose.Schema({
	image: {
		type: String,
	},
	link: {
		type: String
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the Ads model
const Ads = mongoose.model('Ads', AdsSchema);

module.exports = Ads;