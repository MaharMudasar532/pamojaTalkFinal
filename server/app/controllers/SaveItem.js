const SaveItem = require('../models/SaveItem');
const User = require('../models/user.js');
const Item = require('../models/item.js');

exports.saveItem = async (req, res) => {
    try {
        const { item_id, user_id } = req.body;

        const checkItem = await SaveItem.findOne({ item_id, user_id });
        if (checkItem) {
            return res.json({
                message: "Item already saved",
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
                const saveItem = new SaveItem({ item_id, user_id });
                const result = await saveItem.save();
                return res.json({
                    message: "Item Saved Successfully!",
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

exports.unsaveItem = async (req, res) => {
    try {
        const { item_id, user_id } = req.body;

        const data = await SaveItem.findOneAndDelete({ item_id, user_id });
        if (data) {
            return res.json({
                message: "Item Unsaved Successfully!",
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

exports.viewSaveItem = async (req, res) => {
    try {
        const { user_id } = req.body;

        const count = await SaveItem.countDocuments({ user_id });

        const result = await SaveItem.find({ user_id })
            .populate({
                path: 'user_id',
                select: 'user_name email image block_status',
                model: User,
            })
            .populate({
                path: 'item_id',
                model: Item,
            })
            .sort({ 'item_id.created_at': -1 });

        return res.json({
            message: "Saved Items by that user",
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

        const result = await SaveItem.findOne({ item_id, user_id });

        if (result) {
            return res.json({
                message: "Item is already saved by that User",
                status: true,
                Saved: true,
                result,
            });
        } else {
            return res.json({
                message: "Item isn't saved by that User",
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
