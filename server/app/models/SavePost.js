const mongoose = require('mongoose');

// Define the schema for the Save Post
const SavePostSchema = new mongoose.Schema({
	post_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Posts',
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

// Create the Save_post model
const SavePost = mongoose.model('SavePost', SavePostSchema);

module.exports = SavePost;