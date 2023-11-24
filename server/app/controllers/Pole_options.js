const PoleOption = require('../models/Pole_options.js');
const VotePole = require('../models/vote_pole.js');

exports.create = async (req, res) => {
    try {
        if (!req.body.question_id || req.body.question_id === '') {
            return res.json({
                message: "Please Enter question_id ",
                status: false,
            });
        } else {
            const { option_text, question_id } = req.body;
            const poleOption = new PoleOption({
                question_id,
                option_text,
            });

            const savedOption = await poleOption.save();

            return res.json({
                message: "Pole Option Added Successfully!",
                status: true,
                result: savedOption,
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

exports.update = async (req, res) => {
    try {
        if (!req.body.options_id || req.body.options_id === '') {
            return res.json({
                message: "options_id is required",
                status: false,
            });
        } else {
            const poleOption = await PoleOption.findById(req.body.options_id);

            if (poleOption) {
                const oldOptionText = poleOption.option_text;
                const { option_text } = req.body;

                if (option_text === undefined || option_text === '') {
                    option_text = oldOptionText;
                }

                poleOption.option_text = option_text;
                poleOption.updated_at = Date.now();
                const updatedOption = await poleOption.save();

                return res.json({
                    message: "Pole Option Updated Successfully!",
                    status: true,
                    result: updatedOption,
                });
            } else {
                return res.json({
                    message: "Pole Option not found",
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

exports.delete = async (req, res) => {
    try {
        const poleOption = await PoleOption.findById(req.body.options_id);

        if (poleOption) {
            await poleOption.deleteOne();
            await VotePole.deleteMany({ option_id: poleOption._id });

            return res.json({
                message: "Pole Option Deleted Successfully!",
                status: true,
                result: poleOption,
            });
        } else {
            return res.json({
                message: "Pole Option not found",
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

exports.deleteALLOptions = async (req, res) => {
    try {
        const question_id = req.body.question_id;
        const poleOptions = await PoleOption.find({ question_id });

        if (poleOptions.length > 0) {
            await PoleOption.deleteMany({ question_id });
            await VotePole.deleteMany({ question_id });

            return res.json({
                message: "All Pole Options Deleted Successfully!",
                status: true,
                result: poleOptions,
            });
        } else {
            return res.json({
                message: "No Pole Options found for deletion",
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
