
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fastcsv = require("fast-csv");
const fs = require("fs");

const friend_requests = function (friend_requests) {
	this.sender_id = friend_requests.sender_id;
	this.receiver_id = friend_requests.receiver_id;
	this.status = friend_requests.receiver_id;

};
friend_requests.sendRequest = async (req, res) => {

	if (!req.body.sender_id || req.body.sender_id === '') {
		res.json({
			message: "Please Enter Sender ID",
			status: false,
		});
	} else {
		const data = await sql.query(`SELECT * FROM "friend_requests" where sender_id = $1 AND receiver_id = $2`
			, [req.body.sender_id, req.body.receiver_id]);
		if (data.rowCount > 0) {
			res.json({
				message: "Already Requested!",
				status: true,
				result: data.rows,

			});
		} else {
			sql.query(`INSERT INTO "friend_requests"
			( friend_request_id , status, sender_id , receiver_id, created_at, updated_at )
					   VALUES (DEFAULT, $1, $2,$3, 'NOW()','NOW()' ) RETURNING *`
				, [req.body.status, req.body.sender_id, req.body.receiver_id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						res.json({
							message: "Friend Requests sent Successfully!",
							status: true,
							result: result.rows,
						});
					}
				});
		}

	};
}

//same for unfriend!
friend_requests.removeRequest = async (req, res) => {
	const data = await sql.query(`select * from "friend_requests" where sender_id = $1 AND receiver_id = $2`
		, [req.body.sender_id, req.body.receiver_id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "friend_requests" where sender_id = $1 AND receiver_id = $2`
			, [req.body.sender_id, req.body.receiver_id], (err, result) => {
				if (err) {
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					res.json({
						message: "Request Removed Successfully!",
						status: true,
						result: data.rows,

					});
				}
			});
	} else {
		res.json({
			message: "No Such Request Found",
			status: false,
		});
	}
}

//All Unfriend users to be send request to them// to be friend...
friend_requests.viewAll_UnfriendUsers = async (req, res) => {
	const data = await sql.query(`SELECT Count(*)
	FROM "users"
	WHERE "users".user_id != $1
	AND "users".user_id NOT IN (
	  SELECT receiver_id
	  FROM "friend_requests"
	  WHERE sender_id = $1
	)`, [req.body.user_id]);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT *
		FROM "users"
		WHERE "users".user_id != $1
		AND "users".user_id NOT IN (
		  SELECT receiver_id
		  FROM "friend_requests"
		  WHERE sender_id = $1
		)
		ORDER BY "users".created_at DESC; `, [req.body.user_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT *
		FROM "users"
		WHERE "users".user_id != $1
		AND "users".user_id NOT IN (
		  SELECT receiver_id
		  FROM "friend_requests"
		  WHERE sender_id = $1
		)ORDER BY "users".created_at DESC
		LIMIT $2 OFFSET $3 ` , [req.body.user_id, limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "All unfriend Users",
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


friend_requests.viewAll_SendedRequests = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "friend_requests" 
	where sender_id = $1  AND status = $2`, [req.body.user_id, 'pending']);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT "friend_requests".friend_request_id as req_id,
		"friend_requests".created_at as req_date_time, 
		 "users".* 
		FROM "friend_requests" JOIN "users" ON "friend_requests".receiver_id = "users".user_id
		where "friend_requests".sender_id = $1 AND "friend_requests".status = $2
		ORDER by "friend_requests".created_at DESC `, [req.body.user_id, 'pending']);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT "friend_requests".friend_request_id as req_id,
		"friend_requests".created_at as req_date_time, "users".* 
		FROM "friend_requests" JOIN "users" ON "friend_requests".receiver_id = "users".user_id
		where "friend_requests".sender_id = $1 AND "friend_requests".status = $2
		ORDER by "friend_requests".created_at DESC 
		LIMIT $3 OFFSET $4 ` , [req.body.user_id, "pending", limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "All Friend Request",
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

friend_requests.viewAll_ReceivedRequests = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "friend_requests" 
	where receiver_id = $1  AND status = $2`, [req.body.user_id, 'pending']);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT "friend_requests".friend_request_id as req_id,
		"friend_requests".created_at as req_date_time, 
		 "users".* 
		FROM "friend_requests" JOIN "users" ON "friend_requests".sender_id = "users".user_id
		where "friend_requests".receiver_id = $1 AND "friend_requests".status = $2
		ORDER by "friend_requests".created_at DESC `, [req.body.user_id, 'pending']);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT "friend_requests".friend_request_id as req_id,
		"friend_requests".created_at as req_date_time, 
		 "users".* 
		FROM "friend_requests" JOIN "users" ON "friend_requests".sender_id = "users".user_id
		where "friend_requests".receiver_id = $1 AND "friend_requests".status = $2
		ORDER by "friend_requests".created_at DESC 
		LIMIT $3 OFFSET $4 ` , [req.body.user_id, "pending", limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "All Friend Request",
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


friend_requests.viewAllFriends = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "friend_requests" 
	where receiver_id = $1  AND status = $2`, [req.body.sender_id, 'accepted']);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "friend_requests"  
		where receiver_id = $1 AND status = $2
		ORDER by created_at DESC `, [req.body.sender_id, 'accepted']);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "friend_requests"
		where  receiver_id = $1 AND status = $2
		ORDER by created_at DESC 
		LIMIT $3 OFFSET $4 ` , [req.body.receiver_id, "accepted", limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "All Friend Request",
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


friend_requests.respondToRequest = async (req, res) => {
	if (req.body.friend_request_id === '') {
		res.json({
			message: "friend request id is required",
			status: false,
		});
	} else {
		const itemData = await sql.query(`select * from "friend_requests" where friend_request_id = $1`, [req.body.friend_request_id]);
		if (itemData.rowCount > 0) {

			const oldstatus = itemData.rows[0].status;

			let { friend_request_id, status } = req.body;

			if (status === undefined || status === '') {
				status = oldstatus;
			}
			sql.query(`update "friend_requests" SET status = $1
						WHERE friend_request_id = $2;`,
				[status, friend_request_id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount > 0) {
							const data = await sql.query(`select * from "friend_requests" where friend_request_id = $1`, [req.body.friend_request_id]);
							res.json({
								message: `Friend Request ${status} Successfully!`,
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



module.exports = friend_requests;
