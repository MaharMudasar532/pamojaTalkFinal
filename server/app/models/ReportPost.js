const mongoose = require('mongoose');

// Define the schema for the category
const CommentPostSchema = new mongoose.Schema({
	post_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Posts',
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

// Create the CommentPost model
const CommentPost = mongoose.model('ReportPost', CommentPostSchema);

module.exports = CommentPost;