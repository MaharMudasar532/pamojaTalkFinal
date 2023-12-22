
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fastcsv = require("fast-csv");
const fs = require("fs");
const Admin = require('../models/admin.js');
const User = require('../models/user.js');
const Post = require('../models/posts.js');

exports.create = async (req, res) => {
    try {
        if (!req.body.user_id || req.body.user_id === '') {
            return res.json({
                message: "Please Enter user_id",
                status: false,
            });
        }

        const { user_id, description, post_location } = req.body;
        const photo = [];

        if (req.files) {
            req.files.forEach(function (file) {
                photo.push(file.path);
            });
        }

        const newPost = new Post({
            user_id,
            images: photo,
            description,
            post_location,
        });

        const savedPost = await newPost.save();

        if (savedPost) {
            return res.json({
                message: "Post Added Successfully!",
                status: true,
                result: savedPost,
            });
        } else {
            return res.json({
                message: "Try Again",
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

exports.viewSpecific = async (req, res) => {
    try {
        const item = await Post.findById(req.body.post_id);

        if (!item) {
            res.json({
                message: "Post not found",
                status: false,
            });
        } else {
            res.json({
                message: "Specific Post Details",
                status: true,
                result: item,
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

exports.view_user_all_posts = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const count = await Post.countDocuments({ user_id });

        const result = await Post.find({ user_id })
            .populate({
                path: 'user_id',
                select: 'user_name image',
                model: User,
            });

        if (result) {
            return res.json({
                message: "Specific User Posts",
                status: true,
                count,
                result,
            });
        } else {
            return res.json({
                message: "No posts found for this user",
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

exports.view_friends_users_posts = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const count = await Post.countDocuments({ user_id });

        const result = await Post.find({ user_id })
            .populate({
                path: 'user_id',
                select: 'user_name image',
                model: User,
            });

        if (result) {
            return res.json({
                message: "Specific User Posts",
                status: true,
                count,
                result,
            });
        } else {
            return res.json({
                message: "No posts found for this user",
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

exports.viewAll = async (req, res) => {
    try {
        const { limit, page } = req.body;

        const totalItems = await Post.countDocuments();

        let aggregationPipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_data',
                },
            },
            {
                $lookup: {
                    from: 'admins',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'admin_data',
                },
            },
            {
                $unwind: {
                    path: '$user_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$admin_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'likeposts',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'likes',
                },
            },
            {
                $lookup: {
                    from: 'commentposts',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'comments',
                },
            },
            {
                $project: {
                    Post_id: '$_id',
                    likesCount: { $size: '$likes' },
                    commentsCount: { $size: '$comments' },
                    post_name: 1,
                    images: 1,
                    description: 1,
                    post_location: 1,
                    created_at: 1,
                    updated_at: 1,

                    user_id: '$user_data._id',
                    user_name: '$user_data.user_name',
                    user_image: '$user_data.image',
                    user_email: '$user_data.email',

                    admin_id: '$admin_data._id',
                    admin_name: '$admin_data.user_name',
                    admin_email: '$admin_data.email',
                    admin_image: '$admin_data.image',
                },
            },
            {
                $sort: { _id: -1 },
            },
        ];

        if (page && limit) {
            const skip = (page - 1) * limit;
            aggregationPipeline.push({
                $skip: skip,
            });
            aggregationPipeline.push({
                $limit: limit,
            });
        }

        const items = await Post.aggregate(aggregationPipeline);

        res.json({
            message: "All Post Details",
            status: true,
            count: totalItems,
            result: items,
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


exports.update = async (req, res) => {
    try {
        if (!req.body.post_id || req.body.post_id === '') {
            return res.json({
                message: "post_id is required",
                status: false,
            });
        }

        const post = await Post.findById(req.body.post_id);

        if (post) {
            const { description, post_location } = req.body;

            if (description !== undefined && description !== '') {
                post.description = description;
            }

            if (post_location !== undefined && post_location !== '') {
                post.post_location = post_location;
            }

            if (req.files) {
                req.files.forEach(function (file) {
                    post.images.push(file.path);
                });
            }

            const updatedPost = await post.save();

            return res.json({
                message: "Post Updated Successfully!",
                status: true,
                result: updatedPost,
            });
        } else {
            return res.json({
                message: "Post not found",
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

exports.DeleteImage = async (req, res) => {
    try {
        if (!req.body.post_id || req.body.post_id === '' || !req.body.image_path) {
            return res.json({
                message: "post_id and image_path are required",
                status: false,
            });
        }

        const post = await Post.findById(req.body.post_id);

        if (post) {
            const { image_path } = req.body;

            const updatedImages = post.images.filter((image) => image !== image_path);

            fs.unlink(image_path, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err}`);
                } else {
                    console.log('File deleted successfully.');
                }
            });

            post.images = updatedImages;
            const updatedPost = await post.save();

            return res.json({
                message: "Post Image Deleted Successfully!",
                status: true,
                result: updatedPost,
            });
        } else {
            return res.json({
                message: "Post not found",
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

exports.delete = async (req, res) => {
    try {
        if (!req.body.post_id || req.body.post_id === '') {
            return res.json({
                message: "post_id is required",
                status: false,
            });
        }

        const post = await Post.findById(req.body.post_id);

        if (post) {
            post.images.forEach((image_path) => {
                fs.unlink(image_path, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err}`);
                    } else {
                        console.log(`File ${image_path} deleted successfully.`);
                    }
                });
            });

            const deletedPost = await Post.findByIdAndDelete(req.body.post_id);

            return res.json({
                message: "Post Deleted Successfully!",
                status: true,
                result: deletedPost,
            });
        } else {
            return res.json({
                message: "Post not found",
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

exports.getYears = async (req, res) => {
    try {
        const years = await Post.distinct('created_at.year');

        return res.json({
            message: "Years in Posts",
            status: true,
            result: years,
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

exports.getAllUsers_MonthWise_count = async (req, res) => {
    try {
        const year = req.body.year;

        const months = await Post.aggregate([
            {
                $match: {
                    'created_at.year': year,
                },
            },
            {
                $group: {
                    _id: '$created_at.month',
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);

        return res.json({
            message: "Monthly added Posts",
            status: true,
            result: months,
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
