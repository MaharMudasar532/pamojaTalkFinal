const mongoose = require('mongoose');

// Define the schema for the Item
const ItemSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	item_name: {
		type: String
	},
	images: [{
		type: String
	}],
	description: {
		type: String
	},
	category_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Category',
	},
	price: {
		type: String
	},
	condition: {
		type: String
	},
	location: {
		type: String
	},
	created_at: {
		type: String,
	},
	updated_at: {
		type: String
	},
});

// Create the CommentItem model
const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;