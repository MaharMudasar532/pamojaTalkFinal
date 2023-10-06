const mongoose = require('mongoose');

// Define the schema for the posts
const PostsSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	images: [{
		type: String
	}],
	description: {
		type: String
	},
	post_location: {
		type: String
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the Posts model
const Posts = mongoose.model('Posts', PostsSchema);

module.exports = Posts;