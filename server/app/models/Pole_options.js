	const mongoose = require('mongoose');

	// Define the schema for the Pole_options
	const Pole_optionsSchema = new mongoose.Schema({
		question_id: {
			type: mongoose.Types.ObjectId,
			ref: 'Pole',
		},
		option_text: {
			type: String
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
	
	// Create the Pole_options model
	const Pole_options = mongoose.model('Pole_options', Pole_optionsSchema);
	
	module.exports = Pole_options;