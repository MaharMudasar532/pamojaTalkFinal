const mongoose = require('mongoose');

// Define the schema for the category
const ReportItemSchema = new mongoose.Schema({
	item_id: {
		type: mongoose.Types.ObjectId,
        ref: 'Item',
	},
	user_id: {
		type: mongoose.Types.ObjectId,
        ref: 'User',
	},
	type: {
		type: String
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the ReportItem model
const ReportItem = mongoose.model('ReportItem', ReportItemSchema);

module.exports = ReportItem;