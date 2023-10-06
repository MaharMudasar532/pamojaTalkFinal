
const Category = require('../models/category');

exports.create = async (req, res) => {
    try {
        const { category_name } = req.body;

        if (!category_name) {
            res.json({
                message: "Please Enter category_name",
                status: false,
            });
            return;
        }

        let category = new Category({
            category_name,
        });

        if (req.file) {
            category.category_image = req.file.path;
        }

        await category.save();

        res.json({
            message: "Category Added Successfully!",
            status: true,
            result: category,
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

exports.viewSpecific = async (req, res) => {
    try {
        const { category_id } = req.body;

        if (!category_id) {
            res.json({
                message: "Category ID is required",
                status: false,
            });
            return;
        }

        const category = await Category.findById(category_id);

        if (!category) {
            res.json({
                message: "Category Not Found",
                status: false,
            });
            return;
        }

        res.json({
            message: "Category Details",
            status: true,
            result: category,
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

exports.view_all_with_item_count = async (req, res) => {
    try {
        const data = await Category.aggregate([
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "category_id",
                    as: "items",
                },
            },
            {
                $project: {
                    category_name: 1,
                    category_image: 1,
                    Total_Items: { $size: "$items" },
                },
            },
            {
                $sort: { created_at: -1 },
            },
        ]);

        res.json({
            message: "Category Details",
            status: true,
            count: data.length,
            result: data,
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
        const { page = 1, limit = 10 } = req.body;

        // Calculate the number of documents to skip based on the page and limit
        const skip = (page - 1) * limit;

        // Find documents with skip and limit options
        const categories = await Category.find({})
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        // Get the total count of documents
        const totalCount = await Category.countDocuments({});

        res.json({
            message: "Category Details",
            status: true,
            count: totalCount,
            result: categories,
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
        const { category_id, category_name } = req.body;

        if (!category_id) {
            res.json({
                message: "Category ID is required",
                status: false,
            });
            return;
        }

        let category = await Category.findById(category_id);
        console.log(category);
        if (!category) {
            res.json({
                message: "Category Not Found",
                status: false,
            });
            return;
        } else {

            const oldcategory_image = category.category_image;
            category.category_name = req.body.category_name || category.category_name;

            if (req.file) {
                category.category_image = req.file.path;
            } else {
                category.category_image = oldcategory_image;
            }

            await category.save();

            res.json({
                message: "Category Updated Successfully!",
                status: true,
                result: category,
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

exports.search = async (req, res) => {
    try {
        const { category_name } = req.body;

        if (!category_name) {
            res.json({
                message: "Please provide a category_name for searching",
                status: false,
            });
            return;
        }

        const categories = await Category.find({
            category_name: { $regex: `${category_name}`, $options: "i" },
        }).sort({ created_at: -1 });

        res.json({
            message: "Search results",
            status: true,
            result: categories,
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

exports.delete = async (req, res) => {
    try {
        const { category_id } = req.body;

        if (!category_id) {
            res.json({
                message: "Category ID is required",
                status: false,
            });
            return;
        }

        const category = await Category.findById(category_id);

        if (!category) {
            res.json({
                message: "Category Not Found",
                status: false,
            });
            return;
        }

        await category.deleteOne();

        res.json({
            message: "Category Deleted Successfully!",
            status: true,
            result: category,
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
