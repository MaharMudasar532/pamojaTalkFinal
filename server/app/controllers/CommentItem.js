const CommentItem = require('../models/CommentItem');
const User = require('../models/User');
const Item = require('../models/Item');

exports.CommentItem = async (req, res) => {
	try {
		const { user_id, item_id, comment } = req.body;

		if (!item_id || item_id === '') {
			res.json({
				message: "Please Enter item_id",
				status: false,
			});
			return;
		} else if (!user_id) {
			res.json({
				message: "Please Enter user_id",
				status: false,
			});
			return;
		}

		const user = await User.findById(user_id);
		const item = await Item.findById(item_id);

		if (!user) {
			res.json({
				message: "Entered User ID is not present",
				status: false,
			});
			return;
		}

		if (!item) {
			res.json({
				message: "Entered Item ID is not present",
				status: false,
			});
			return;
		}

		const commentItem = new CommentItem({
			item_id,
			user_id,
			comment,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await commentItem.save();

		res.json({
			message: "Item commented Successfully!",
			status: true,
			result: commentItem,
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

exports.UnCommentItem = async (req, res) => {
	try {
		const { comment_item_id, user_id, item_id } = req.body;

		const commentItem = await CommentItem.findOne({
			_id: comment_item_id,
			user_id,
			item_id,
		});

		if (!commentItem) {
			res.json({
				message: "Comment Item Not Found",
				status: false,
			});
			return;
		}

		await commentItem.deleteOne();

		res.json({
			message: "Item Uncommented Successfully!",
			status: true,
			result: commentItem,
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

exports.ViewCommentItem = async (req, res) => {
	try {
		const { user_id } = req.body;

		const count = await CommentItem.countDocuments({ user_id });

		const comments = await CommentItem.find({ user_id })
			.populate('user_id', ['user_name', 'email', 'image', 'block_status'])
			.populate('item_id');

		res.json({
			message: "All Items' comments by that User",
			status: true,
			count,
			result: comments,
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


exports.CheckItem = async (req, res) => {
	try {
		const { item_id, user_id } = req.body;

		const commentItem = await CommentItem.findOne({ item_id, user_id });

		if (commentItem) {
			res.json({
				message: "Item is already commented by that User",
				status: true,
				commented: true,
				result: commentItem,
			});
		} else {
			res.json({
				message: "Item isn't commented by that User",
				status: true,
				commented: false,
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

exports.ViewItemComments = async (req, res) => {
	try {
		const { item_id } = req.body;

		const count = await CommentItem.countDocuments({ item_id });

		res.json({
			message: "Item comments",
			status: true,
			Allcomments: count,
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

exports.ViewItemCommentsAll = async (req, res) => {
	try {
		const { item_id } = req.body;

		const count = await CommentItem.countDocuments({ item_id });

		const comments = await CommentItem.find({ item_id })
			.populate('user_id', ['user_name', 'email', 'image', 'block_status'])
			.populate('item_id');

		res.json({
			message: "Item All comments",
			status: true,
			count,
			result: comments,
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
