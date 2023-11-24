const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const secretKey = 'jdfbdsjkfdsahfohajkslcnlmnclskjdiohgvkdsvljbmdscljdvnkdjvndsvmksdjvasckdgmsdvnkascmksvnkcjsdvnkdsvslkdvjsdvakvsdsdv';

module.exports = (socket, next) => {
    const token = socket.handshake?.query?.token;
    console.log(token)
    jwt.verify(token, secretKey, async (err, payload) => {
        if (err) {
            console.log(err);
            return next(new Error('You are not authorized'));
        }

        const { user_id } = payload;
        console.log(user_id);
        // Find the user by their user_id in the MongoDB database
        try {
            const user = await User.findOne({ user_id });

            if (!user) {
                console.log(user);
                return next(new Error('User does not exist'));
            }
            console.log(user);
            // Update the user's socketID in the user document
            user.socketID = socket.id;
            await user.save();

            next();
        } catch (error) {
            console.log(error);
            return next(new Error('Error updating user socketID'));
        }
    });
};
