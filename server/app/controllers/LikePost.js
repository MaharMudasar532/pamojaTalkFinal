const LikePost = require('../models/LikePost.js');
const User = require('../models/user.js');
const Post = require('../models/posts');

exports.likePost = async (req, res) => {
    try {
        const { post_id, user_id } = req.body;

        const checkPost = await LikePost.findOne({ post_id, user_id });
        if (checkPost) {
            return res.json({
                message: "Post already liked",
                status: false,
            });
        }

        const user = await User.findOne({ _id: user_id });
        const post = await Post.findOne({ _id: post_id });

        if (!post_id || post_id === '') {
            return res.json({
                message: "Please Enter post_id",
                status: false,
            });
        } else if (!user_id) {
            return res.json({
                message: "Please Enter user_id",
                status: false,
            });
        } else if (post) {
            if (user) {
                const likePost = new LikePost({ post_id, user_id });
                const result = await likePost.save();
                return res.json({
                    message: "Post liked Successfully!",
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

exports.unlikePost = async (req, res) => {
    try {
        const { post_id, user_id } = req.body;

        const data = await LikePost.findOneAndDelete({ post_id, user_id });
        if (data) {
            return res.json({
                message: "Post Unliked Successfully!",
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

exports.viewLikePost = async (req, res) => {
    try {
        const { user_id } = req.body;

        const count = await LikePost.countDocuments({ user_id });

        const result = await LikePost.aggregate([
            {
                $match: { user_id },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'post_id',
                    foreignField: '_id',
                    as: 'Post',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $unwind: '$Post',
            },
            {
                $project: {
                    'user.user_name': 1,
                    'user.email': 1,
                    'user.image': 1,
                    'user.block_status': 1,
                    'Post.*': 1,
                },
            },
            {
                $sort: { 'Post.created_at': -1 },
            },
        ]);

        return res.json({
            message: "All Posts Liked by that User",
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

        const result = await LikePost.findOne({ post_id, user_id });

        if (result) {
            return res.json({
                message: "Post is already liked by that User",
                status: true,
                liked: true,
                result,
            });
        } else {
            return res.json({
                message: "Post isn't liked by that User",
                status: true,
                liked: false,
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

exports.viewPostLikes = async (req, res) => {
    try {
        const { post_id } = req.body;

        const count = await LikePost.countDocuments({ post_id });

        return res.json({
            message: "Post likes",
            status: true,
            AllLikes: count,
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
