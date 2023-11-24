const CommentPost = require('../models/CommentPost');
const User = require('../models/User');
const Post = require('../models/posts');

exports.CommentPost = async (req, res) => {
	try {
		const { user_id, post_id, comment } = req.body;

		if (!post_id || post_id === '') {
			res.json({
				message: "Please Enter post_id",
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
		const post = await Post.findById(post_id);

		if (!user) {
			res.json({
				message: "Entered User ID is not present",
				status: false,
			});
			return;
		}

		if (!post) {
			res.json({
				message: "Entered Post  is not present",
				status: false,
			});
			return;
		}

		const commentPost = new CommentPost({
			post_id,
			user_id,
			comment,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await commentPost.save();

		res.json({
			message: "Post commented Successfully!",
			status: true,
			result: commentPost,
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

exports.UnCommentPost = async (req, res) => {
	try {
		const { comment_post_id, user_id, post_id } = req.body;

		const commentPost = await CommentPost.findOne({
			_id: comment_post_id,
			user_id,
			post_id,
		});

		if (!commentPost) {
			res.json({
				message: "Comment Post Not Found",
				status: false,
			});
			return;
		}

		await commentPost.deleteOne();

		res.json({
			message: "Post Uncommented Successfully!",
			status: true,
			result: commentPost,
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

exports.ViewCommentPost = async (req, res) => {
	try {
		const { user_id } = req.body;

		const count = await CommentPost.countDocuments({ user_id });

		const comments = await CommentPost.find({ user_id })
			.populate('user_id', ['user_name', 'email', 'image', 'block_status'])
			.populate('post_id');

		res.json({
			message: "All Posts' comments by that User",
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


exports.CheckPost = async (req, res) => {
	try {
		const { post_id, user_id } = req.body;

		const commentPost = await CommentPost.findOne({ post_id, user_id });

		if (commentPost) {
			res.json({
				message: "Post is already commented by that User",
				status: true,
				commented: true,
				result: commentPost,
			});
		} else {
			res.json({
				message: "Post isn't commented by that User",
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

exports.ViewPostComments = async (req, res) => {
	try {
		const { post_id } = req.body;

		const count = await CommentPost.countDocuments({ post_id });

		res.json({
			message: "Post comments",
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

exports.ViewPostCommentsAll = async (req, res) => {
	try {
	  const { post_id, limit, page } = req.body;
	  const perPage = limit || 10; // Number of comments to return per page
	  const currentPage = page || 1; // Current page number
  
	  const count = await CommentPost.countDocuments({ post_id });
  
	  const comments = await CommentPost.find({ post_id })
		.populate('user_id', ['user_name', 'email', 'image', 'block_status'])
		.populate('post_id')
		.sort({ created_at: -1 })
		.skip((currentPage - 1) * perPage) 
		.limit(perPage); 
  
	  res.json({
		message: "Post All comments",
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
  
