
const mongoose = require('mongoose');

// Define the schema for the AdminSchema
const AdminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	user_name: {
		type: String
	},
	password: {
		type: String
	},
	image: {
		type: String
	},
	created_at: {
		type: String
	},
	updated_at: {
		type: String
	},
});

// Create the Admin model
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;