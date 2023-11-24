const mongoose = require('mongoose');

// Define the schema for the category
const CommentItemSchema = new mongoose.Schema({
	item_id: {
		type: mongoose.Types.ObjectId,
        ref: 'Item',
	},
	user_id: {
		type: mongoose.Types.ObjectId,
        ref: 'User',
	},
	comment: {
		type: String
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the CommentItem model
const CommentItem = mongoose.model('CommentItem', CommentItemSchema);

module.exports = CommentItem;