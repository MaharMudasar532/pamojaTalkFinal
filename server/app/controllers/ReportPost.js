const ReportPost = require('../models/ReportPost');
const User = require('../models/user.js');
const Post = require('../models/posts.js');

exports.ReportPost = async (req, res) => {
	try {
		const { user_id, post_id, type } = req.body;

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

		const reportPost = new ReportPost({
			post_id,
			user_id,
			type,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await reportPost.save();

		res.json({
			message: "Post Reported Successfully!",
			status: true,
			result: reportPost,
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

exports.UnReportPost = async (req, res) => {
	try {
		const { Report_post_id, user_id, post_id } = req.body;

		const reportPost = await ReportPost.findOne({
			_id: Report_post_id,
			user_id,
			post_id,
		});

		if (!reportPost) {
			res.json({
				message: "Report Post Not Found",
				status: false,
			});
			return;
		}

		await reportPost.deleteOne();

		res.json({
			message: "Post UnReported Successfully!",
			status: true,
			result: reportPost,
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

exports.ViewReportPost = async (req, res) => {
	try {
		const { user_id } = req.body;

		const count = await ReportPost.countDocuments({ user_id });

		const Reports = await ReportPost.find({ user_id })
			.populate('user_id', ['user_name', 'email', 'image', 'block_status'])
			.populate('post_id');

		res.json({
			message: "All Posts' Reports by that User",
			status: true,
			count,
			result: Reports,
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

		const ReportPost = await ReportPost.findOne({ post_id, user_id });

		if (ReportPost) {
			res.json({
				message: "Post is already Reported by that User",
				status: true,
				Reported: true,
				result: ReportPost,
			});
		} else {
			res.json({
				message: "Post isn't Reported by that User",
				status: true,
				Reported: false,
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

exports.ViewPostReports = async (req, res) => {
	try {
		const { post_id } = req.body;

		const count = await ReportPost.countDocuments({ post_id });

		res.json({
			message: "Post Reports",
			status: true,
			AllReports: count,
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

exports.ViewPostReportsAll = async (req, res) => {
	try {
	  const { post_id, limit, page } = req.body;
	  const perPage = limit || 10; // Number of Reports to return per page
	  const currentPage = page || 1; // Current page number
  
	  const count = await ReportPost.countDocuments({ post_id });
  
	  const Reports = await ReportPost.find({ post_id })
		.populate('user_id', ['user_name', 'email', 'image', 'block_status'])
		.populate('post_id')
		.sort({ created_at: -1 })
		.skip((currentPage - 1) * perPage) 
		.limit(perPage); 
  
	  res.json({
		message: "Post All Reports",
		status: true,
		count,
		result: Reports,
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
  
