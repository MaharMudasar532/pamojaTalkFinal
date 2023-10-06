
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const pg = require('pg');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const chat = function (chat) {
	this.chat_name = chat.chat_name;
};

chat.create = async (req, res) => {

	const { sender, receiver, message } = req.body;
	if (sender === undefined || sender === null || sender === '' ||
		receiver === undefined || receiver === null || receiver === '' ||
		message === undefined || message === null || message === ''
	) {
		res.json({
			message: "sender, Receiver, Message is required",
			status: false,
		});
	} else {
		let photo;
		if (req.file) {
			const { path } = req.file
			photo = path
		}



		io.on('connection', (socket) => {
			console.log('A user connected');

			socket.on('private message', (data) => {
				const { sender, receiver, message } = data;
				// Save the message to the database and then deliver it to the recipient
				sql.query('INSERT INTO messages (message_id , sender, receiver, message) VALUES ($1, $2, $3,$4)', ['NOW()', sender, receiver, message], (error, result) => {
					if (!error) {
						io.to(receiver).emit('private message', { sender, message });
					}
				});
			});

			socket.on('disconnect', () => {
				console.log('A user disconnected');
			});
		});


	};
}

chat.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "chat" WHERE ( chat_id = $1)`, [req.body.chat_id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "chat Details",
				status: true,
				result: result.rows
			});
		}
	});
}


chat.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "chat"`);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "chat" ORDER by created_at DESC `);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "chat" ORDER by created_at DESC 
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "chat Details",
			status: true,
			count: data.rows[0].count,
			result: result.rows,
		});
	} else {
		res.json({
			message: "could not fetch",
			status: false
		})
	}
}

chat.update = async (req, res) => {
	if (req.body.chat_id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const chatData = await sql.query(`select * from "chat" where chat_id = $1`, [req.body.chat_id]);
		if (chatData.rowCount > 0) {
			const oldchat_name = chatData.rows[0].chat_name;
			const oldchat_image = chatData.rows[0].chat_image;

			let { chat_name, chat_id } = req.body;

			if (chat_name === undefined || chat_name === '') {
				chat_name = oldchat_name;
			}
			let photo = oldchat_image
			if (req.file) {
				const { path } = req.file;
				photo = path
			}

			sql.query(`UPDATE "chat" SET chat_name =  $1 , 
		chat_image = $2 WHERE chat_id = $3;`,
				[chat_name, photo, chat_id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "chat" where chat_id = $1`, [req.body.chat_id]);
							res.json({
								message: "chat Updated Successfully!",
								status: true,
								result: data.rows,
							});
						} else if (result.rowCount === 0) {
							res.json({
								message: "Not Found",
								status: false,
							});
						}
					}
				});
		} else {
			res.json({
				message: "Not Found",
				status: false,
			});

		}
	}
}

chat.search = async (req, res) => {
	sql.query(`SELECT * FROM "chat" WHERE chat_name ILIKE  $1 ORDER BY "createdat" DESC `
		, [`${req.body.chat_name}%`], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Search's items data",
					status: true,
					result: result.rows,
				});
			}
		});
}



chat.delete = async (req, res) => {
	const data = await sql.query(`select * from "chat" where  chat_id = $1`, [req.body.chat_id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "chat" WHERE chat_id = $1;`, [req.body.chat_id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "chat Deleted Successfully!",
					status: true,
					result: data.rows,

				});
			}
		});
	} else {
		res.json({
			message: "Not Found",
			status: false,
		});
	}
}
module.exports = chat;