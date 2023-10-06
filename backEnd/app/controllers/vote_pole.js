const VotePole = require('../models/vote_pole');

exports.votePole = async (req, res) => {
    try {
        if (!req.body.question_id || req.body.question_id === '') {
            return res.json({
                message: "Please Enter question ID",
                status: false,
            });
        } else {
            const { option_id, user_id, question_id } = req.body;

            const existingVote = await VotePole.findOne({ question_id, user_id });

            if (existingVote) {
                if (existingVote.option_id.equals(option_id)) {
                    // User has voted for the same option, remove the vote.
                    await existingVote.deleteOne();
                    return res.json({
                        message: "Vote Removed Successfully!",
                        status: true,
                        result: existingVote,
                    });
                } else {
                    // Update the user's vote to the new option.
                    existingVote.option_id = option_id;
                    existingVote.updated_at = Date.now();
                    await existingVote.save();
                    return res.json({
                        message: "Pole Vote Updated Successfully!",
                        status: true,
                        result: existingVote,
                    });
                }
            } else {
                // User is voting for the first time.
                const newVote = new VotePole({
                    question_id,
                    user_id,
                    option_id,
                });
                const savedVote = await newVote.save();
                return res.json({
                    message: "Pole Voted Successfully!",
                    status: true,
                    result: savedVote,
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
