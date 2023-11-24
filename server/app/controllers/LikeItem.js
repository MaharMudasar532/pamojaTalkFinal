const LikeItem = require('../models/LikeItem');
const User = require('../models/User');
const Item = require('../models/Item');

exports.likeItem = async (req, res) => {
    try {
        const { item_id, user_id } = req.body;

        const checkItem = await LikeItem.findOne({ item_id, user_id });
        if (checkItem) {
            return res.json({
                message: "Item already liked",
                status: false,
            });
        }

        const user = await User.findOne({ _id:user_id });
        const item = await Item.findOne({ _id:item_id });

        if (!item_id || item_id === '') {
            return res.json({
                message: "Please Enter item_id",
                status: false,
            });
        } else if (!user_id) {
            return res.json({
                message: "Please Enter user_id",
                status: false,
            });
        } else if (item) {
            if (user) {
                const likeItem = new LikeItem({ item_id, user_id });
                const result = await likeItem.save();
                return res.json({
                    message: "Item liked Successfully!",
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
                message: "Entered Item ID is not present",
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

exports.unlikeItem = async (req, res) => {
    try {
        const { item_id, user_id } = req.body;

        const data = await LikeItem.findOneAndDelete({ item_id, user_id });
        if (data) {
            return res.json({
                message: "Item Unliked Successfully!",
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

exports.viewLikeItem = async (req, res) => {
    try {
        const { user_id } = req.body;

        const count = await LikeItem.countDocuments({ user_id });

        const result = await LikeItem.aggregate([
            {
                $match: { user_id },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user',
                },
            },
            {
                $lookup: {
                    from: 'items',
                    localField: 'item_id',
                    foreignField: 'item_id',
                    as: 'item',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $unwind: '$item',
            },
            {
                $project: {
                    'user.user_name': 1,
                    'user.email': 1,
                    'user.image': 1,
                    'user.block_status': 1,
                    'item.*': 1,
                },
            },
            {
                $sort: { 'item.created_at': -1 },
            },
        ]);

        return res.json({
            message: "All Items Liked by that User",
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

exports.checkItem = async (req, res) => {
    try {
        const { item_id, user_id } = req.body;

        const result = await LikeItem.findOne({ item_id, user_id });

        if (result) {
            return res.json({
                message: "Item is already liked by that User",
                status: true,
                liked: true,
                result,
            });
        } else {
            return res.json({
                message: "Item isn't liked by that User",
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

exports.viewItemLikes = async (req, res) => {
    try {
        const { item_id } = req.body;

        const count = await LikeItem.countDocuments({ item_id });

        return res.json({
            message: "Item likes",
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
