
const fastcsv = require("fast-csv");
const fs = require("fs");
const { listenerCount } = require("process");
const Pole = require('../models/pole.js');
const Option = require('../models/pole_options.js');
const VotePole = require('../models/vote_pole.js');
const mongoose = require('mongoose');
exports.create = async (req, res) => {
    try {
        if (!req.body.question || req.body.question === '') {
            return res.json({
                message: "Please Enter Question ",
                status: false,
            });
        } else {
            const { question } = req.body;

            const pole = new Pole({
                question,
            });

            const savedPole = await pole.save();

            return res.json({
                message: "Pole Added Successfully!",
                status: true,
                result: savedPole,
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
        const pole = await Pole.findById(req.body.pole_id);

        if (pole) {
            const options = await Option.aggregate([
                {
                    $match: {
                        question_id: pole._id,
                    },
                },
                {
                    $lookup: {
                        from: "vote_poles",
                        localField: "_id",
                        foreignField: "option_id",
                        as: "votes",
                    },
                },
                {
                    $group: {
                        _id: "$question_id",
                        options: {
                            $push: {
                                options_id: "$_id",
                                option_text: "$option_text",
                                option_vote_count: { $size: "$votes" },
                            },
                        },
                    },
                },
            ]);

            return res.json({
                message: "Specific Pole Details",
                status: true,
                AllVotes: options.length > 0 ? options[0].options.reduce((totalVotes, option) => totalVotes + option.option_vote_count, 0) : 0,
                result: {
                    question: pole.question,
                    pole_id: pole._id,
                    options: options.length > 0 ? options[0].options : [],
                },
            });
        } else {
            return res.json({
                message: "Pole not found",
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
        const { page, limit, user_id } = req.body;

        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 100;

        const skip = (pageNumber - 1) * pageSize;

        // Fetch poles with pagination
        let poles = await Pole.find({})
            .skip(skip)
            .limit(pageSize);

            let options = await Option.aggregate([
                {
                    $match: {
                        question_id: { $in: poles.map((pole) => pole._id) },
                    },
                },
                {
                    $lookup: {
                        from: "vote_poles",
                        localField: "_id",
                        foreignField: "option_id",
                        as: "votes",
                    },
                },
                {
                    $group: {
                        _id: "$question_id",
                        options: {
                            $push: {
                                id: "$_id",
                                choice: "$option_text",
                                votes: { $size: "$votes" },
                            },
                        },
                        voted: {
                            $max: {
                                $in: [new mongoose.Types.ObjectId(user_id), "$votes.user_id"],
                            },
                        },
                    },
                },
            ]);
            
            // Map poles with options
            let poleData = poles.map((pole) => ({
                question: pole.question,
                pole_id: pole._id,
                voted: options.find((option) => option._id.toString() === pole._id.toString())?.voted || false, 
                options: options.find((option) => option._id.toString() === pole._id.toString())?.options || [],
            }));
            
            return res.json({
                message: "All Pole Details",
                status: true,
                count: poles.length,
                result: poleData,
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



exports.update = async (req, res) => {
    try {
        if (!req.body.pole_id || req.body.pole_id === '') {
            return res.json({
                message: "Pole id is required",
                status: false,
            });
        } else {
            let pole = await Pole.findById(req.body.pole_id);

            if (pole) {
                let oldQuestion = pole.question;
                let { question } = req.body;

                if (question === undefined || question === '') {
                    question = oldQuestion;
                }

                pole.question = question;
                let updatedPole = await pole.save();

                return res.json({
                    message: "Pole Updated Successfully!",
                    status: true,
                    result: updatedPole,
                });
            } else {
                return res.json({
                    message: "Pole not found",
                    status: false,
                });
            }
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

exports.search = async (req, res) => {
    try {
        const poles = await Pole.find({ question: { $regex: new RegExp(`^${req.body.question}`, 'i') } }).sort({ created_at: -1 });

        return res.json({
            message: "Pole Search's data",
            status: true,
            result: poles,
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

exports.delete = async (req, res) => {
    try {
        const pole = await Pole.findById(req.body.pole_id);

        if (pole) {
            await pole.deleteOne();
            await Option.deleteMany({ question_id: pole._id });
            await VotePole.deleteMany({ question_id: pole._id });

            return res.json({
                message: "Pole Deleted Successfully!",
                status: true,
                result: pole,
            });
        } else {
            return res.json({
                message: "Pole not found",
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
