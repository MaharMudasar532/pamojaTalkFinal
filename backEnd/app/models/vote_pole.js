const mongoose = require('mongoose');

// Define the schema for the vote_pole
const vote_poleSchema = new mongoose.Schema({
	question_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Pole',
	},
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	option_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Pole_options',
	},
	created_at: {
		type: String,
		default: Date.now,
	},
	updated_at: {
		type: String,
		default: Date.now,
	},
});

// Create the vote_pole model
const vote_pole = mongoose.model('vote_pole', vote_poleSchema);

module.exports = vote_pole;