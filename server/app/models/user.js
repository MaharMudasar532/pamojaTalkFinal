
const mongoose = require('mongoose');

// Define the schema for the User
const UserSchema = new mongoose.Schema({
	user_name: {
		type: String,
	},
	bio: {
		type: String
	},
	email: {
		type: String,
	},
	username: {
		type: String,
	},
	password: {
		type: String,
	},
	image: {
		type: String,
	},
	fcm_token: {
		type: String,
	},
	phone: {
		type: String,
	},
	block_status: {
		type: String,
	},
	latitude: {
		type: String,
	},
	longitude: {
		type: String,
	},
	subscription_status: {
		type: String,
	},
	signup_type: {
		type: String,
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
	user_name:{
		type:String
	}

});

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
