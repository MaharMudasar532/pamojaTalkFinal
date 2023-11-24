
const { sql } = require("../config/db.config");
const fs = require("fs");
const Item = require('../models/item.js');
const User = require('../models/user.js');
const Admin = require('../models/admin.js');
const Category = require('../models/category.js');
const { ObjectId } = require("mongodb");
exports.create = async (req, res) => {
    try {
        if (!req.body.item_name || req.body.item_name === '') {
            res.json({
                message: "Please Enter item_name",
                status: false,
            });
        } else {
            const { user_id, item_name, description, category_id, price, location, condition } = req.body;
            let images = [];

            if (req.files) {
                req.files.forEach(function (file) {
                    images.push(file.path);
                });
            }

            const newItem = new Item({
                user_id,
                item_name,
                images,
                description,
                category_id,
                price,
                location,
                condition,
            });

            const savedItem = await newItem.save();

            res.json({
                message: "Item Added Successfully!",
                status: true,
                result: savedItem,
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


exports.viewItem = async (req, res) => {
    try {
        const item = await Item.findById(req.body.item_id);

        if (!item) {
            res.json({
                message: "Item not found",
                status: false,
            });
        } else {
            res.json({
                message: "Specific Item Details",
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
exports.viewItem_By_Category = async (req, res) => {
    try {
        const { limit, page, category_id } = req.body;
        const id = new ObjectId(category_id)
        const totalItems = await Item.countDocuments({category_id});

        let aggregationPipeline = [
            {
                $match: { category_id: id },
            },
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
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category_data',
                },
            },
            {
                $unwind: {
                    path: '$category_data',
                },
            },
            {
                $lookup: {
                    from: 'likeitems',
                    localField: '_id',
                    foreignField: 'item_id',
                    as: 'likes',
                },
            },
            {
                $lookup: {
                    from: 'commentitems',
                    localField: '_id',
                    foreignField: 'item_id',
                    as: 'comments',
                },
            },
            {
                $project: {
                    item_id: '$_id',
                    likesCount: { $size: '$likes' },
                    commentsCount: { $size: '$comments' },
                    item_name: 1,
                    images: 1,
                    description: 1,
                    price: 1,
                    condition: 1,
                    location: 1,
                    created_at: 1,
                    updated_at: 1,

                    user_id: '$user_data._id',
                    user_name: '$user_data.user_name',
                    user_image: '$user_data.image',
                    user_email: '$user_data.email',

                    category_id: '$category_data._id',
                    category_name: '$category_data.category_name',

                    admin_id: '$admin_data._id',
                    admin_name: '$admin_data.user_name',
                    admin_email: '$admin_data.email',
                    admin_image: '$admin_data.image',
                },
            },
            {
                $sort: { created_at: -1 },
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
        console.log(aggregationPipeline);
        const items = await Item.aggregate(aggregationPipeline);

        res.json({
            message: "All Item Details",
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


exports.viewItem_By_Category_count = async (req, res) => {
    try {
        const { category_id } = req.body;
        const count = await Item.countDocuments({ category_id });

        res.json({
            message: "Specific Item Count",
            status: true,
            result: count,
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
exports.viewAll = async (req, res) => {
    try {
        const { limit, page } = req.body;

        const totalItems = await Item.countDocuments();

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
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category_data',
                },
            },
            {
                $unwind: {
                    path: '$category_data',
                },
            },
            {
                $lookup: {
                    from: 'likeitems',
                    localField: '_id',
                    foreignField: 'item_id',
                    as: 'likes',
                },
            },
            {
                $lookup: {
                    from: 'commentitems',
                    localField: '_id',
                    foreignField: 'item_id',
                    as: 'comments',
                },
            },
            {
                $project: {
                    item_id: '$_id',
                    likesCount: { $size: '$likes' },
                    commentsCount: { $size: '$comments' },
                    item_name: 1,
                    images: 1,
                    description: 1,
                    price: 1,
                    condition: 1,
                    location: 1,
                    created_at: 1,
                    updated_at: 1,

                    user_id: '$user_data._id',
                    user_name: '$user_data.user_name',
                    user_image: '$user_data.image',
                    user_email: '$user_data.email',

                    category_id: '$category_data._id',
                    category_name: '$category_data.category_name',

                    admin_id: '$admin_data._id',
                    admin_name: '$admin_data.user_name',
                    admin_email: '$admin_data.email',
                    admin_image: '$admin_data.image',
                },
            },
            {
                $sort: { created_at: -1 },
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

        const items = await Item.aggregate(aggregationPipeline);

        res.json({
            message: "All Item Details",
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
        if (!req.body.item_id) {
            res.json({
                message: "item_id is required",
                status: false,
            });
        } else {
            const item = await Item.findById(req.body.item_id);

            if (!item) {
                res.json({
                    message: "Item not found",
                    status: false,
                });
            } else {
                item.item_name = req.body.item_name || item.item_name;
                item.description = req.body.description || item.description;
                item.category_id = req.body.category_id || item.category_id;
                item.price = req.body.price || item.price;
                item.condition = req.body.condition || item.condition;
                item.location = req.body.location || item.location;

                if (req.files) {
                    req.files.forEach(function (file) {
                        item.images.push(file.path);
                    });
                }

                await item.save();

                res.json({
                    message: "Item Updated Successfully!",
                    status: true,
                    result: item,
                });
            }
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

exports.search = async (req, res) => {
    try {
        const items = await Item.find({ item_name: { $regex: `${req.body.item_name}`, $options: 'i' } }).sort({ created_at: -1 });

        res.json({
            message: "Item Search's data",
            status: true,
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

exports.DeleteImage = async (req, res) => {
    try {
        if (!req.body.item_id) {
            res.json({
                message: "item_id is required",
                status: false,
            });
        } else {
            const item = await Item.findById(req.body.item_id);

            if (!item) {
                res.json({
                    message: "Item not found",
                    status: false,
                });
            } else {
                const image_path = req.body.image_path;

                item.images = item.images.filter(photo => photo !== image_path);

                fs.unlink(image_path, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err}`);
                    } else {
                        console.log('File deleted successfully.');
                    }
                });

                await item.save();

                res.json({
                    message: "Item Image Deleted Successfully!",
                    status: true,
                    result: item,
                });
            }
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

exports.delete = async (req, res) => {
    try {
        const item = await Item.findById(req.body.item_id);

        if (!item) {
            res.json({
                message: "Item not found",
                status: false,
            });
        } else {
            const All_Images = item.images;

            All_Images.forEach((image_path) => {
                fs.unlink(image_path, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err}`);
                    } else {
                        console.log(`File ${image_path} deleted successfully.`);
                    }
                });
            });

            await item.deleteOne();

            res.json({
                message: "Item Deleted Successfully!",
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
