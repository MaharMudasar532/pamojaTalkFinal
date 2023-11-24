const SavePost = require('../models/SavePost');
const User = require('../models/User');
const Post = require('../models/posts');

exports.savePost = async (req, res) => {
    try {
        const { post_id, user_id } = req.body;

        const checkPost = await SavePost.findOne({ post_id, user_id });
        if (checkPost) {
            return res.json({
                message: "Post already saved",
                status: false,
            });
        }

        const user = await User.findOne({ _id: user_id });
        const post = await Post.findOne({ _id: post_id });

        if (!post_id || post_id === '') {
            return res.json({
                message: "Please Enter Post_id",
                status: false,
            });
        } else if (!user_id) {
            return res.json({
                message: "Please Enter user_id",
                status: false,
            });
        } else if (post) {
            if (user) {
                const savePost = new SavePost({ post_id, user_id });
                const result = await savePost.save();
                return res.json({
                    message: "Post Saved Successfully!",
                    status: true,
                    result,
                });
            } else {
                return res.json({
                    message: "Entered User ID is not present",
                    status: false,
                });
            }
        } else {
            return res.json({
                message: "Entered Post ID is not present",
                status: false,
            });
        }
    } catch (err) {
        console.error(err);
        return res.json({
            message: "Try Again",
            status: false,
            error: err.message,
        });
    }
};

exports.unsavePost = async (req, res) => {
    try {
        const { post_id, user_id } = req.body;

        const data = await SavePost.findOneAndDelete({ post_id, user_id });
        if (data) {
            return res.json({
                message: "Post Unsaved Successfully!",
                status: true,
                result: data,
            });
        } else {
            return res.json({
                message: "Not Found",
                status: false,
            });
        }
    } catch (err) {
        console.error(err);
        return res.json({
            message: "Try Again",
            status: false,
            error: err.message,
        });
    }
};

exports.viewSavePost = async (req, res) => {
    try {
        const { user_id } = req.body;

        const count = await SavePost.countDocuments({ user_id });

        const result = await SavePost.find({ user_id })
            .populate({
                path: 'user_id',
                select: 'user_name email image block_status',
                model: User,
            })
            .populate({
                path: 'post_id',
                model: Post,
            })
            .sort({ 'post_id.created_at': -1 });

        return res.json({
            message: "Saved Posts by that user",
            status: true,
            count,
            result,
        });
    } catch (err) {
        console.error(err);
        return res.json({
            message: "Try Again",
            status: false,
            error: err.message,
        });
    }
};
exports.checkPost = async (req, res) => {
    try {
        const { post_id, user_id } = req.body;

        const result = await SavePost.findOne({ post_id, user_id });

        if (result) {
            return res.json({
                message: "Post is already saved by that User",
                status: true,
                Saved: true,
                result,
            });
        } else {
            return res.json({
                message: "Post isn't saved by that User",
                status: true,
                Saved: false,
            });
        }
    } catch (err) {
        console.error(err);
        return res.json({
            message: "Try Again",
            status: false,
            error: err.message,
        });
    }
};
