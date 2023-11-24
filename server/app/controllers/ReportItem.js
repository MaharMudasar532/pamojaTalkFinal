const ReportItem = require('../models/ReportItem');
const User = require('../models/user.js');
const Item = require('../models/item.js');

exports.ReportItem = async (req, res) => {
	try {
		const { user_id, item_id, type } = req.body;

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

		const reportItem = new ReportItem({
			item_id,
			user_id,
			type,
			created_at: new Date(),
			updated_at: new Date(),
		});

		await reportItem.save();

		res.json({
			message: "Item Reported Successfully!",
			status: true,
			result: reportItem,
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

exports.UnReportItem = async (req, res) => {
	try {
		const { Report_item_id, user_id, item_id } = req.body;

		const reportItem = await ReportItem.findOne({
			_id: Report_item_id,
			user_id,
			item_id,
		});

		if (!reportItem) {
			res.json({
				message: "Report Item Not Found",
				status: false,
			});
			return;
		}

		await reportItem.deleteOne();

		res.json({
			message: "Item UnReported Successfully!",
			status: true,
			result: reportItem,
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

exports.ViewReportItem = async (req, res) => {
	try {
		const { user_id } = req.body;

		const count = await ReportItem.countDocuments({ user_id });

		const Reports = await ReportItem.find({ user_id })
			.populate('user_id', ['user_name', 'email', 'image', 'block_status'])
			.populate('item_id');

		res.json({
			message: "All Items' Reports by that User",
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


exports.CheckItem = async (req, res) => {
	try {
		const { item_id, user_id } = req.body;

		const ReportItem = await ReportItem.findOne({ item_id, user_id });

		if (ReportItem) {
			res.json({
				message: "Item is already Reported by that User",
				status: true,
				Reported: true,
				result: ReportItem,
			});
		} else {
			res.json({
				message: "Item isn't Reported by that User",
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

exports.ViewItemReports = async (req, res) => {
	try {
		const { item_id } = req.body;

		const count = await ReportItem.countDocuments({ item_id });

		res.json({
			message: "Item Reports",
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

exports.ViewItemReportsAll = async (req, res) => {
	try {
		const { item_id } = req.body;

		const count = await ReportItem.countDocuments({ item_id });

		const Reports = await ReportItem.find({ item_id })
			.populate('user_id', ['user_name', 'email', 'image', 'block_status'])
			.populate('item_id');

		res.json({
			message: "Item All Reports",
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
