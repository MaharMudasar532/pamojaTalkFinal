const jwt = require('jsonwebtoken');
const { sql } = require('../config/db.config');

const secretKey = process.env.TOKEN;
module.exports = (socket, next) => {
    const token = socket.handshake?.query?.token;
    jwt.verify(token, secretKey, async (err, payload) => {
        if (err) return next(new Error('You are not authorized'));

        // payload is the data that was encrypted using jwt
        const { user_id } = payload;
        const userData = await sql.query(`SELECT * FROM users WHERE user_id = ${user_id}`)
        if(userData.rowCount<1){
            return res.json({
                status: false,
                message:'user does not exist',
            })
        }
        const userUpdate = await sql.query(`UPDATE users SET socketID = ${socket.id} 
        WHERE user_id = ${user_id}`)

        next();
    });
}