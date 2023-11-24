
const { sql } = require("../config/db.config");
const fs = require("fs");
const Item = require('../models/Item');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Category = require('../models/category');
const Notification = require('../models/Notification');
const Post = require('../models/posts');
const axios = require('axios');
const mongoose = require('mongoose'); // Make sure to import mongoose

const { ObjectId } = require("mongodb");
exports.create = async (req, res) => {
    try {
        if (!req.body.sender_id || req.body.sender_id === '') {
            res.json({
                message: "Please Enter sender id",
                status: false,
            });
        } else {
            const { sender_id, receiver_id, message, table_name, table_data_id, fcm_token, created_at, updated_at } = req.body;

            const newNotification = new Notification({
                sender_id,
                receiver_id,
                message,
                table_name,
                table_data_id,
                fcm_token,
                created_at,
                updated_at,
            });
            sendNotification(fcm_token, `PAMOJA's Notifications`, newNotification)
            const savedNotification = await newNotification.save();

            res.json({
                message: "Notification Added Successfully!",
                status: true,
                result: savedNotification,
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
        let notification = await Notification.findById({ _id: req.body._id });
        console.log(notification);
        const tableModel = mongoose.model(notification.table_name);
        const data = await tableModel.findById({ _id: notification.table_data_id });
        // const data = await notification.table_name.findById({_id:req.body._id});

        if (!notification) {
            res.json({
                message: "notification not found",
                status: false,
            });
        } else {
            res.json({
                message: "Specific notification Details",
                status: true,
                result: notification,
                notification_data: data
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
        const { user_id, limit, page } = req.body;

        const totalNotification = await Notification.countDocuments({ receiver_id: user_id });

        let aggregationPipeline = [


            {
                $lookup: {
                    from: 'users',
                    localField: 'sender_id  ',
                    foreignField: '_id',
                    as: 'user_data',
                },
            },
            {
                $lookup: {
                    from: 'admins',
                    localField: 'sender_id',
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

        const notification = await Notification.aggregate(aggregationPipeline);

        res.json({
            message: "All Notification Details",
            status: true,
            count: totalNotification,
            result: notification,
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
        const notification = await Notification.findById(req.body.notification_id);

        if (!notification) {
            res.json({
                message: "Notification not found",
                status: false,
            });
        } else {


            await notification.deleteOne();

            res.json({
                message: "Notification Deleted Successfully!",
                status: true,
                result: notification,
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



const sendNotification = async (fcmToken, title, body) => {
    console.log(
        'send notification====>',
        fcmToken,
        // userName,
        // type,
        // receiverUserId,
        // senderUserId,
        // post,
        body,
    );
    try {
        let eventData = {};
        const url = 'https://fcm.googleapis.com/fcm/send';
        const headers = {
            'Content-Type': 'application/json',
            Authorization:
                'key=AAAA4ZjCrZA:APA91bGfHruPJmxiFGkRCXa3qg6kPLAYO2q_uAjNOXX7kbwIEexhlBS5rz_1lkVB2_TILmTJdwfB6tx3F2KpYNQhHwTlgSm8RegnXJuXULgiqlrCi470jTpOPGosQhtxqb-61_-7uixi',
        };

        eventData = {
            to: fcmToken,
            collapse_key: 'type_a',
            notification: {
                body: body,
                title: title,
            },
            data: {
                body: 'Body of Your Notification in Data',
                title: 'Title of Your Notification in Title',
                type: 'helperAlert',
                redirect_to: 'HelperNotification',
                senderUserId: body.sender_id,
            },
        };


        const APIData = await axios.post(
            url,
            {
                ...eventData,
            },
            {
                headers: headers,
            },
        );
        console.log('API Response', APIData);
        return APIData;
    } catch (error) {
        console.log('error=>', error);
    }
};