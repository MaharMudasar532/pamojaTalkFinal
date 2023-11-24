const bcrypt = require("bcryptjs");
const moment = require('moment');
const jwt = require("jsonwebtoken");
const TOKEN = 'jdfbdsjkfdsahfohajkslcnlmnclskjdiohgvkdsvljbmdscljdvnkdjvndsvmksdjvasckdgmsdvnkascmksvnkcjsdvnkdsvslkdvjsdvakvsdsdv';
const geolib = require('geolib');
const User = require('../models/user.js');
const OTP = require('../models/otp.js');
const Item = require('../models/item.js');
const Posts = require('../models/posts.js'); // Import the Posts model with the correct capitalization
const Chat = require('../models/chat.js');
const Message = require('../models/message.js');
const { ObjectId } = require("mongodb");

exports.signUp = async (req, res) => {
	try {
		console.log(req.body);
		const { user_name, email, password, signup_type, longitude, latitude } = req.body;
		console.log(signup_type);

		if (!signup_type) {
			return res.json({
				status: false,
				message: 'signup_type is required',
			});
		}

		if (!user_name) {
			return rs.json({
				status: false,
				message: "Name is required"
			})
		}


		if (signup_type !== 'email' && signup_type !== 'facebook' && signup_type !== 'google' && signup_type !== 'apple') {
			return res.json({
				status: false,
				message: 'signup_type can only be [Email, facebook, google, or apple]',
			});
		}

		let user;
		if (signup_type == 'email') {
			if (!email || !password) {
				return res.json({
					status: false,
					message: 'email and password are required to sign up with Email',
				});
			}

			user = await User.findOne({ email, signup_type });
			if (user) {
				return res.json({
					status: false,
					message: 'user already exists with this Email',
				});
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			user = new User({
				user_name,
				email,
				password: hashedPassword,
				image: req.file ? req.file.path : null,
				block_status: false,
				signup_type,
				longitude,
				latitude,
				bio: req.bio ? req.bio : null,
			});

			await user.save();
		} else if (signup_type == 'google' || signup_type == 'apple' || signup_type == 'facebook') {
			if (!email) {
				return res.json({
					status: false,
					message: 'email is required to sign up with google, apple, or facebook',
				});
			}

			user = await User.findOne({ email });
			if (user) {
				return res.json({
					status: false,
					message: 'user already exists with this email',
				});
			}

			user = new User({
				email,
				image: req.file ? req.file.path : null,
				signup_type,
				longitude,
				latitude,
			});

			await user.save();
		}

		if (!user) {
			return res.json({
				status: false,
				message: 'Could not register user',
			});
		}

		res.json({
			status: true,
			message: 'user registered',
			result: user,
		});
	} catch (err) {
		res.json({
			status: false,
			message: err.message,
		});
	}
};

exports.sign_in = async (req, res) => {
	try {
		const { email, password, signup_type, fcm_token } = req.body;

		if (!signup_type) {
			return res.json({
				status: false,
				message: 'signup_type is required',
			});
		}

		if (signup_type !== 'email' && signup_type !== 'google' && signup_type !== 'apple' && signup_type !== 'facebook') {
			return res.json({
				status: false,
				message: 'signup_type can only be [email, google, apple, or facebook]',
			});
		}

		let user;
		if (signup_type == 'email') {
			if (!email || !password) {
				return res.json({
					status: false,
					message: 'email and password are required to sign in with email',
				});
			}

			user = await User.findOne({ email, signup_type });
			if (!user) {
				return res.json({
					status: false,
					message: 'user does not exist with this email',
				});
			}

			const compare = await bcrypt.compare(password, user.password);
			if (!compare) {
				return res.json({
					status: false,
					message: 'Incorrect password',
				});
			}
		} else if (signup_type == 'google' || signup_type == 'facebook' || signup_type == 'apple') {
			if (!email) {
				return res.json({
					status: false,
					message: 'email is required to sign in with google, apple, or facebook',
				});
			}

			user = await User.findOne({ email });
			if (!user) {
				return res.json({
					status: false,
					message: 'user does not exist with this email',
				});
			}
		}

		const token = jwt.sign({ id: user._id }, TOKEN);
		let updateFields = {
			fcm_token: fcm_token || user.fcm_token,
		}
		console.log(updateFields);
		await User.findByIdAndUpdate(user._id, updateFields);
		return res.json({
			status: true,
			token,
			message: 'Signed in',
			result: user,
			fcm_token: fcm_token
		});
	} catch (err) {
		console.log(err);
		res.json({
			status: false,
			message: err.message,
		});
	}
};

exports.updateProfile = async (req, res) => {
	try {
		if (!req.body.user_id) {
			return res.json({
				message: "user_id is required",
				status: false,
			});
		}

		const user = await User.findOne({ _id: req.body.user_id });

		if (!user) {
			return res.json({
				message: "User not found",
				status: false,
			});
		}
		console.log(req.body.block_status)
		// Map the request body fields to the corresponding user fields
		const updateFields = {
			username: req.body.username || user.username,
			email: req.body.email || user.email,
			signup_type: req.body.signup_type || user.signup_type,
			gender: req.body.gender || user.gender,
			phone: req.body.phone || user.phone,
			subscription_status: req.body.subscription_status || user.subscription_status,
			block_status: req.body.block_status || user.block_status,
			date_of_birth: req.body.date_of_birth || user.date_of_birth,
			image: req.file ? req.file.path : user.image,
			longitude: req.body.longitude || user.longitude,
			latitude: req.body.latitude || user.latitude,
			bio: req.body?.bio
		};

		// Update the user document in MongoDB
		await User.findByIdAndUpdate(user._id, updateFields);

		// Fetch the updated user
		const updatedUser = await User.findOne({ _id: req.body.user_id });

		res.json({
			message: "User Updated Successfully!",
			status: true,
			result: updatedUser,
		});
	} catch (err) {
		console.error(err);
		res.json({
			message: "Try Again",
			status: false,
			error: err.message,
		});
	}
};

exports.SubscribedUsers = async (req, res) => {
	try {
		const users = await User.find({ subscription_status: 'subscribed' });

		res.json({
			message: "Users Subscription Details",
			status: true,
			result: users,
		});
	} catch (err) {
		console.error(err);
		res.json({
			message: "Try Again",
			status: false,
			error: err.message,
		});
	}
};

exports.SpecificUser = async (req, res) => {
	const { user_id } = req.body;
	try {
		if (!user_id) {
			const users = await User.find();
			return res.json({
				status: true,
				message: 'All Users fetched',
				result: users,
			});
		} else {
			const user = await User.findById({ _id: user_id });
			if (!user) {
				return res.json({
					status: false,
					message: 'User not found',
				});
			}
			return res.json({
				status: true,
				message: 'User fetched',
				result: user,
			});
		}
	} catch (err) {
		res.json({
			status: false,
			message: err.message,
		});
	}
};

exports.AllUsers = async (req, res) => {
	try {
		const page = req.body.page ? parseInt(req.body.page) : 1;
		const limit = req.body.limit ? parseInt(req.body.limit) : 10;

		const skip = (page - 1) * limit;
		const count = await User.countDocuments({});
		const users = await User.find({})
			.sort({ created_at: 'desc' })
			.skip(skip)
			.limit(limit);

		res.json({
			message: "All User Details",
			status: true,
			count,
			result: users,
		});
	} catch (err) {
		console.error(err);
		res.json({
			message: "Try Again",
			status: false,
			error: err.message,
		});
	}
};

exports.AllUsers_Count = async (req, res) => {
	try {
		const usersCount = await User.countDocuments({});
		const ItemsCount = await Item.countDocuments({});
		const PostsCount = await Posts.countDocuments({});

		res.json({
			message: "Dashboard Counts",
			status: true,
			users: usersCount,
			item: ItemsCount,
			post: PostsCount,

		});
	} catch (err) {
		console.error(err);
		res.json({
			message: "Try Again",
			status: false,
			error: err.message,
		});
	}
};

exports.passwordReset = async (req, res) => {
	const { user_id, newPassword, currentPassword } = req.body;
	try {
		if (!user_id || !newPassword || !currentPassword) {
			return res.json({
				status: false,
				message: 'user_id, newPassword, and currentPassword are required',
			});
		}

		const user = await User.findById(user_id);

		if (!user) {
			return res.json({
				status: false,
				message: 'User does not exist with this user_id',
			});
		}

		if (user.signup_type !== 'email') {
			return res.json({
				status: false,
				message: 'Cannot update password for users with signup_type other than email',
			});
		}

		const compare = await bcrypt.compare(currentPassword, user.password);

		if (!compare) {
			return res.json({
				status: false,
				message: 'Incorrect current password',
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(newPassword, salt);

		user.password = hashPassword;
		await user.save();

		return res.json({
			status: true,
			message: 'Password Updated',
			result: user,
		});
	} catch (err) {
		console.error(err);
		res.json({
			status: false,
			message: err.message,
		});
	}
};

exports.newPassword = async (req, res) => {
	try {
		const email = req.body.email;
		const foundEmailQuery = { email, status: 'verified' };
		const Otp = await OTP.findOne(foundEmailQuery);
		if (Otp) {
			const user = await User.findOne({ email: email });
			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(req.body.password, salt);

			user.password = hashPassword;
			await user.save();

			// Assuming you have an OTP model
			// Replace the following with your OTP deletion logic
			const otpResult = await OTP.findOneAndDelete({ email });

			res.json({
				message: "Password changed",
				status: true,
				user,
			});
		} else {
			res.json({
				message: "Email Not Found",
				status: false,
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: `Internal server error occurred`,
			success: false,
			error: err.message,
		});
	}
};

exports.DeleteUser = async (req, res) => {
	const { user_id } = req.body;
	try {
		const user = await User.findById(user_id);

		if (user) {
			await user.deleteOne();
			res.json({
				message: "User Deleted Successfully!",
				status: true,
				result: user,
			});
		} else {
			res.json({
				message: "User Not Found",
				status: false,
			});
		}
	} catch (err) {
		console.error(err);
		res.json({
			message: "Try Again",
			status: false,
			error: err.message,
		});
	}
};

exports.getUsers_inRange = async (req, res) => {
	try {
		const { user_lat, user_lon, range } = req.body;

		if (!user_lat || !user_lon) {
			return res.status(400).json({ error: 'Latitude and longitude values are required.' });
		}

		const referenceUser = { latitude: parseFloat(user_lat), longitude: parseFloat(user_lon) };

		const users = await User.find({});
		const nearbyUsers = [];

		// Loop through users and calculate distances
		for (const user of users) {
			const distanceInMeters = geolib.getDistance(referenceUser, {
				latitude: user.latitude,
				longitude: user.longitude,
			});

			const distanceInKm = geolib.convertDistance(distanceInMeters, 'km');

			if (distanceInKm <= range) {
				nearbyUsers.push({
					id: user._id,
					user,
					distance: `${distanceInKm} km away from you`,
				});
			}
		}

		if (nearbyUsers.length > 0) {
			res.json({
				message: "NearBy Users",
				status: true,
				result: nearbyUsers,
			});
		} else {
			res.json({
				message: "No Near-By User",
				status: true,
			});
		}
	} catch (err) {
		console.error(err);
		res.json({
			message: "No User Found",
			status: false,
		});
	}
};

exports.getDistance = async (req, res) => {
	try {
		const { user1_lat, user1_lon, user2_lat, user2_lon } = req.body;

		if (!user1_lat || !user1_lon || !user2_lat || !user2_lon) {
			return res.status(400).json({ error: 'Latitude and longitude values are required.' });
		}

		const user1 = { latitude: parseFloat(user1_lat), longitude: parseFloat(user1_lon) };
		const user2 = { latitude: parseFloat(user2_lat), longitude: parseFloat(user2_lon) };

		const distanceInMeters = geolib.getDistance(user1, user2);
		const distanceInKm = geolib.convertDistance(distanceInMeters, 'km');

		res.json({ distance: `${distanceInKm} km away from you` });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: `Internal server error occurred`,
			success: false,
			error: err.message,
		});
	}
};

exports.getUserAndLastMessages = async (req, res) => {
	const _id = req.body._id;

	try {
		const user = await User.findById(_id).exec();

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Find chat documents where the given _id is in the users array
		const chats = await Chat.find({ users: _id }).exec();

		// Get the unique user IDs from the chat documents
		const userIds = chats.reduce((result, chat) => {
			return result.concat(chat.users.map(userId => userId.toString()));
		}, []);

		// Remove duplicates and exclude the given _id
		const uniqueUserIds = [...new Set(userIds)].filter(userId => userId !== _id);

		// Find the users who are in the chats
		const users = await User.find({ _id: { $in: uniqueUserIds } }).exec();

		// Find the last message for each user and add it to the user object
		const usersWithLastMessages = [];

		for (const user of users) {
			const chat = chats.find(chat => chat.users.map(userId => userId.toString()).includes(user._id.toString()));
			if (chat) {
				const lastMessage = await Message.findOne({ chat: chat._id })
					.sort({ createdAt: -1 })
					.exec();

				usersWithLastMessages.push({
					...user._doc,
					lastMessage,
				});
			} else {
				usersWithLastMessages.push({
					...user._doc,
					lastMessage: null, // User has no chat with the given user
				});
			}
		}

		return res.json({ users: usersWithLastMessages });
	} catch (error) {
		return res.status(500).json({ message: 'Server error' });
	}
};




exports.getUser_AllDetails = async (req, res) => {
	const { user_id } = req.body;
	try {
		if (!user_id) {
			const users = await User.find();
			return res.json({
				status: true,
				message: 'All Users fetched',
				result: users,
			});
		} else {
			const user = await User.aggregate([
				{
					$match: { _id: new ObjectId(user_id) }
				},
				{
					$lookup: {
						from: 'posts',
						localField: '_id',
						foreignField: 'user_id',
						as: 'posts'
					}
				},
				{
					$lookup: {
						from: 'items',
						localField: '_id',
						foreignField: 'user_id',
						as: 'items'
					}
				}
			]);

			if (user.length === 0) {
				return res.json({
					status: false,
					message: 'User not found',
				});
			}

			return res.json({
				status: true,
				message: 'User fetched',
				result: user[0],
			});

		}
	} catch (err) {
		res.json({
			status: false,
			message: err.message,
		});
	}
};