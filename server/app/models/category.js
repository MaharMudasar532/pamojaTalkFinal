
const mongoose = require('mongoose');

// Define the schema for the category
const CategorySchema = new mongoose.Schema({
	category_name: {
		type: String,
	},
	category_image: {
		type: String
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the Category model
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;