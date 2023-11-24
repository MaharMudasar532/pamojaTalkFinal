
const Alerts = require('../models/alerts.js');
const geolib = require('geolib');
const User = require('../models/user.js');

exports.create = async (req, res) => {
	try {
		const { alert_name } = req.body;

		if (!alert_name) {
			res.json({
				message: "Please Enter alert_name",
				status: false,
			});
		} else {
			let alert = new Alerts({ alert_name });

			if (req.file) {
				const { path } = req.file;
				alert.alert_image = path;
			}

			await alert.save();

			res.json({
				message: "Alert Added Successfully!",
				status: true,
				result: alert,
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

exports.viewSpecific = async (req, res) => {
	try {
		const alert = await Alerts.findById(req.body.alert_id);

		if (alert) {
			res.json({
				message: "Alert Details",
				status: true,
				result: alert,
			});
		} else {
			res.json({
				message: "Not Found",
				status: false,
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

exports.viewAll = async (req, res) => {
	try {
		const data = await Alerts.countDocuments();
		let limit = req.body.limit;
		let page = req.body.page;
		let result;

		if (!page || !limit) {
			result = await Alerts.find().sort({ created_at: -1 });
		}

		if (page && limit) {
			limit = parseInt(limit);
			const skip = (parseInt(page) - 1) * limit;
			result = await Alerts.find().sort({ created_at: -1 }).skip(skip).limit(limit);
		}

		res.json({
			message: "Alert Details",
			status: true,
			count: data,
			result,
		});
	} catch (err) {
		console.error(err);
		res.json({
			message: "Could not fetch",
			status: false,
			error: err.message,
		});
	}
};

exports.update = async (req, res) => {
	try {
		if (!req.body.alert_id) {
			res.json({
				message: "ID is required",
				status: false,
			});
			return;
		}

		const alert = await Alerts.findById(req.body.alert_id);

		if (!alert) {
			res.json({
				message: "Not Found",
				status: false,
			});
			return;
		}

		const { alert_name } = req.body;

		if (alert_name !== undefined && alert_name !== '') {
			alert.alert_name = alert_name;
		}

		if (req.file) {
			const { path } = req.file;
			alert.alert_image = path;
		}

		await alert.save();

		res.json({
			message: "Alert Updated Successfully!",
			status: true,
			result: alert,
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

exports.search = async (req, res) => {
	try {
		const { alert_name } = req.body;

		if (!alert_name) {
			res.json({
				message: "Please provide alert_name",
				status: false,
			});
			return;
		}

		const alerts = await Alerts.find({ alert_name: { $regex: new RegExp(alert_name, 'i') } }).sort({ created_at: -1 });

		res.json({
			message: "Search items data",
			status: true,
			result: alerts,
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

exports.checkNearBy_public = async (req, res) => {
	try {
		const { user_lat, user_lon, range } = req.body;

		if (!user_lat || !user_lon) {
			return res.status(400).json({ error: 'Latitude and longitude values are required.' });
		}

		const referenceUser = { latitude: parseFloat(user_lat), longitude: parseFloat(user_lon) };

		const users = await User.find({});
		const nearbyUsers = [];

		// Loop through users and calculate distances
		for (const user of users) {
			const distanceInMeters = geolib.getDistance(referenceUser, {
				latitude: user.latitude,
				longitude: user.longitude,
			});

			const distanceInKm = geolib.convertDistance(distanceInMeters, 'km');

			if (distanceInKm <= range) {
				nearbyUsers.push({
					id: user._id,
					user,
					distance: `${distanceInKm} km away from you`,
				});
			}
		}

		if (nearbyUsers.length > 0) {
			res.json({
				message: "NearBy Users",
				status: true,
				result: nearbyUsers,
			});
		} else {
			res.json({
				message: "No Near-By User",
				status: true,
			});
		}
	} catch (err) {
		console.error(err);
		res.json({
			message: "No User Found",
			status: false,
		});
	}
};

exports.checkNearBy_private = async (req, res) => {
	try {
		const { user_lat, user_lon, range } = req.body;

		if (!user_lat || !user_lon) {
			return res.status(400).json({ error: 'Latitude and longitude values are required.' });
		}

		const referenceUser = { latitude: parseFloat(user_lat), longitude: parseFloat(user_lon) };

		const users = await User.find({});
		const nearbyUsers = [];

		// Loop through users and calculate distances
		for (const user of users) {
			const distanceInMeters = geolib.getDistance(referenceUser, {
				latitude: user.latitude,
				longitude: user.longitude,
			});

			const distanceInKm = geolib.convertDistance(distanceInMeters, 'km');

			if (distanceInKm <= range) {
				nearbyUsers.push({
					id: user._id,
					user,
					distance: `${distanceInKm} km away from you`,
				});
			}
		}

		if (nearbyUsers.length > 0) {
			res.json({
				message: "NearBy Users",
				status: true,
				result: nearbyUsers,
			});
		} else {
			res.json({
				message: "No Near-By User",
				status: true,
			});
		}
	} catch (err) {
		console.error(err);
		res.json({
			message: "No User Found",
			status: false,
		});
	}
};

exports.delete = async (req, res) => {
	try {
		if (!req.body.alert_id) {
			res.json({
				message: "ID is required",
				status: false,
			});
			return;
		}

		const alert = await Alerts.findById(req.body.alert_id);

		if (!alert) {
			res.json({
				message: "Not Found",
				status: false,
			});
			return;
		}

		await alert.deleteOne();

		res.json({
			message: "Alert Deleted Successfully!",
			status: true,
			result: alert,
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
