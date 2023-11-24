const mongoose = require('mongoose');

// Define the schema for the LikePost
const LikePostSchema = new mongoose.Schema({
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

// Create the LikePost model
const LikePost = mongoose.model('LikePost', LikePostSchema);

module.exports = LikePost;