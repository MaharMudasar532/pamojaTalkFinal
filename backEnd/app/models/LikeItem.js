const mongoose = require('mongoose');

// Define the schema for the LikeItem
const LikeItemSchema = new mongoose.Schema({
	item_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Item',
	},
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the LikeItem model
const LikeItem = mongoose.model('LikeItem', LikeItemSchema);

module.exports = LikeItem;