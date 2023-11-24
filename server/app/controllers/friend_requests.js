const FriendRequest = require('../models/friend_requests.js'); // Import your model
const User = require('../models/user.js'); // Import your user model
const mongoose = require('mongoose');

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  try {
    // Check if the receiver exists
    const receiver = await User.findById(receiver_id);

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      sender_id,
      receiver_id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Create a new friend request
    const newRequest = new FriendRequest({
      sender_id,
      receiver_id,
      status: 'pending',
    });

    await newRequest.save();

    res.status(201).json({ message: 'Friend request sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  const { sender_id, receiver_id, status } = req.body;

  try {
    // Find and update the friend request
    const request = await FriendRequest.findOneAndUpdate(
      { sender_id, receiver_id, status: 'pending' },
      { $set: { status: status } }
    );

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found or already accepted/rejected' });
    }

    res.json({ message: `Friend request ${status} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove request
exports.remove_Request = async (req, res) => {
	const { sender_id, receiver_id, status } = req.body;
  
	try {
	  // Find and update the friend request
	  const request = await FriendRequest.findOneAndDelete(
		{ sender_id, receiver_id, status: 'pending' },
		{ $set: { status: status } }
	  );
  
	  if (!request) {
		return res.status(404).json({ message: 'Friend request not found or already accepted/rejected' });
	  }
  
	  res.json({ message: `Friend request deleted successfully` });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  };
 
  // Remove request
exports.remove_Friend = async (req, res) => {
	const { sender_id, receiver_id } = req.body;
  
	try {
	  // Find and update the friend request
	  const request = await FriendRequest.findOneAndDelete(
		{
			$or: [
			  { sender_id: sender_id, receiver_id: receiver_id },
			  { sender_id: receiver_id, receiver_id: sender_id },
			],
			status: 'accepted', // Make sure the friend request is accepted.
		  },
	  );
  
	  if (!request) {
		return res.status(404).json({ message: 'Friend request not found or already accepted/rejected' });
	  }
  
	  res.json({ message: `Friend request deleted successfully` });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  };

// View friends with user details
exports.viewAllFriends = async (req, res) => {
	const { _id, page, limit } = req.body;
  
	try {
	  // Find all friends of the specified user
	  const friendRequests = await FriendRequest.find({
		$or: [
		  { sender_id: _id, status: 'accepted' },
		  { receiver_id: _id, status: 'accepted' },
		],
	  });
  
	  const friendIds = friendRequests.map((request) => {
		return request.sender_id.equals(_id) ? request.receiver_id : request.sender_id;
	  });
  
	  // Calculate pagination values
	  const totalCount = friendIds.length;
	  const totalPages = Math.ceil(totalCount / limit);
	  const currentPage = Math.min(page, totalPages);
  
	  // Use pagination values to slice the friendIds array
	  const startIndex = (currentPage - 1) * limit;
	  const endIndex = startIndex + limit;
	  const friendsToRetrieve = friendIds.slice(startIndex, endIndex);
  
	  // Retrieve user details for the friends
	  const friends = await User.find({ _id: { $in: friendsToRetrieve } });
  
	  res.json({
		message: 'Friends',
		currentPage,
		totalPages,
		totalCount,
		friends,
	  });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  };
  

// View unfriended users with user details
exports.viewUnfriendedUsers = async (req, res) => {
	const { _id, page, limit } = req.body;
  
	try {
	  // Find all friends of the specified user
	  const friendRequests = await FriendRequest.find({
		$or: [
		  { sender_id: _id, status: 'accepted' },
		  { receiver_id: _id, status: 'accepted' },
		  { sender_id: _id, status: 'pending' },
		  { receiver_id: _id, status: 'pending' },

		],
	  });
	  const friendIds = friendRequests.map((request) => {
		return request.sender_id.equals(_id) ? request.receiver_id : request.sender_id;
	  });
  
	  // Find all user IDs except the specified user
	  const allUserIds = await User.find(
		{ _id: { $ne: _id } },
		'_id'
	  ).lean();
  
	  // Calculate pagination values
	  const totalCount = allUserIds.length;
	  const totalPages = Math.ceil(totalCount / limit);
	  const currentPage = Math.min(page, totalPages);
  
	  // Use pagination values to slice the allUserIds array
	  const startIndex = (currentPage - 1) * limit;
	  const endIndex = startIndex + limit;
	  const usersToRetrieve = allUserIds.slice(startIndex, endIndex);
  
	  // Retrieve user details for the users
	  const users = await User.find({ _id: { $in: usersToRetrieve.map((user) => user._id) } });
  
	  // Create a set of friend IDs for faster lookup
	  const friendIdsSet = new Set(friendIds.map((id) => id.toString()));
  
	  const result = users.map((user) => {
		return {
		  ...user._doc,
		  isFriend: friendIdsSet.has(user._id.toString()),
		};
	  });
  
	  // Filter the result array to include only users where isFriend is false
	  const unfriendedUsers = result.filter((user) => !user.isFriend);
  
	  res.json({
		message: 'Users not in the friend list',
		currentPage,
		totalPages,
		totalCount: unfriendedUsers.length, 
		users: unfriendedUsers,
	  });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  };
  
  

  
  // View all received friend requests for a user
  exports.viewAllReceivedRequests = async (req, res) => {
	const { _id, page, limit } = req.body;
  
	try {
	  const aggregationPipeline = [
		{
		  $match: {
			receiver_id: new mongoose.Types.ObjectId(_id),
			status: 'pending',
		  },
		},
		{
			$lookup: {
			  from: 'users', // Name of the User collection
			  localField: 'sender_id',
			  foreignField: '_id', // Assuming User's _id is used for sender_id
			  as: 'Request_sender',
			},
		  },

	  ];
  
	  if (page && limit) {
		const offset = (page - 1) * limit;
		aggregationPipeline.push(
		  {
			$skip: offset,
		  },
		  {
			$limit: limit,
		  }
		);
	  }
  
	  const receivedRequests = await FriendRequest.aggregate(aggregationPipeline).exec();
	  console.log(receivedRequests);
  
	  res.json({ message: 'Received friend requests', receivedRequests });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  };


// View all sent friend requests for a user
exports.viewAllSentRequests = async (req, res) => {
	const { _id, page, limit } = req.body;
  
	try {
	  const aggregationPipeline = [
		{
		  $match: {
			sender_id: new mongoose.Types.ObjectId(_id),
			status: 'pending',
		  },
		},
		{
			$lookup: {
			  from: 'users', // Name of the User collection
			  localField: 'receiver_id',
			  foreignField: '_id', // Assuming User's _id is used for sender_id
			  as: 'Request_sender',
			},
		  },

	  ];
  
	  if (page && limit) {
		const offset = (page - 1) * limit;
		aggregationPipeline.push(
		  {
			$skip: offset,
		  },
		  {
			$limit: limit,
		  }
		);
	  }
  
	  const receivedRequests = await FriendRequest.aggregate(aggregationPipeline).exec();
	  console.log(receivedRequests);
  
	  res.json({ message: 'Received friend requests', receivedRequests });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  };
  

// const fastcsv = require("fast-csv");
// const fs = require("fs");
// const FriendRequest = require('../models/friend_requests');
// const User = require('../models/User');

// // Send a friend request
// exports.sendRequest = async (req, res) => {
// 	try {
// 		const { sender_id, receiver_id } = req.body;

// 		if (!sender_id || sender_id === '') {
// 			return res.json({
// 				message: 'Please Enter Sender ID',
// 				status: false,
// 			});
// 		}

// 		const existingRequest = await FriendRequest.findOne({ sender_id, receiver_id });

// 		if (existingRequest) {
// 			return res.json({
// 				message: 'Already Requested!',
// 				status: true,
// 				result: existingRequest,
// 			});
// 		}

// 		const newRequest = new FriendRequest({
// 			sender_id,
// 			receiver_id,
// 			status: 'pending',
// 			created_at: new Date(),
// 			updated_at: new Date(),
// 		});

// 		const savedRequest = await newRequest.save();

// 		return res.json({
// 			message: 'Friend Request sent Successfully!',
// 			status: true,
// 			result: savedRequest,
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		return res.json({
// 			message: 'Try Again',
// 			status: false,
// 			err,
// 		});
// 	}
// };

// // Remove a friend request (unfriend)
// exports.removeRequest = async (req, res) => {
// 	try {
// 		const { sender_id, receiver_id } = req.body;

// 		const existingRequest = await FriendRequest.findOne({ sender_id, receiver_id });

// 		if (existingRequest) {
// 			await existingRequest.remove();

// 			return res.json({
// 				message: 'Request Removed Successfully!',
// 				status: true,
// 				result: existingRequest,
// 			});
// 		}

// 		return res.json({
// 			message: 'No Such Request Found',
// 			status: false,
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		return res.json({
// 			message: 'Try Again',
// 			status: false,
// 			err,
// 		});
// 	}
// };
// // View all unfriend users
// exports.viewAllUnfriendUsers = async (req, res) => {
// 	try {
// 		let { _id, limit, page } = req.body;
// 		let query = {
// 			_id: { $ne: _id },
// 			_id: { $nin: await getSenderIds(_id) },
// 		};

// 		let dataCount = await FriendRequest.countDocuments(query);
// 		let result;

// 		if (!page || !limit) {
// 			result = await FriendRequest.find(query)
// 				.sort({ created_at: -1 })
// 				.exec();
// 		}

// 		if (page && limit) {
// 			limit = parseInt(limit);
// 			let offset = (parseInt(page) - 1) * limit;
// 			result = await FriendRequest.find(query)
// 				.sort({ created_at: -1 })
// 				.skip(offset)
// 				.limit(limit)
// 				.exec();
// 		}

// 		res.json({
// 			message: 'All unfriend Users',
// 			status: true,
// 			count: dataCount,
// 			result,
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		res.json({
// 			message: 'Could not fetch',
// 			status: false,
// 		});
// 	}
// };

// // View all sent friend requests
// exports.viewAllSendedRequests = async (req, res) => {
// 	try {
// 		let { user_id, limit, page } = req.body;
// 		const query = {
// 			sender_id: user_id,
// 			status: 'pending',
// 		};

// 		const dataCount = await FriendRequest.countDocuments(query);
// 		let result;

// 		if (!page || !limit) {
// 			result = await FriendRequest.find(query)
// 				.sort({ created_at: -1 })
// 				.exec();
// 		}

// 		if (page && limit) {
// 			limit = parseInt(limit);
// 			const offset = (parseInt(page) - 1) * limit;
// 			result = await FriendRequest.find(query)
// 				.sort({ created_at: -1 })
// 				.skip(offset)
// 				.limit(limit)
// 				.exec();
// 		}

// 		res.json({
// 			message: 'All Friend Request',
// 			status: true,
// 			count: dataCount,
// 			result,
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		res.json({
// 			message: 'Could not fetch',
// 			status: false,
// 		});
// 	}
// };

// // View all received friend requests
// exports.viewAllReceivedRequests = async (req, res) => {
// 	try {
// 		let { user_id, limit, page } = req.body;
// 		const query = {
// 			receiver_id: user_id,
// 			status: 'pending',
// 		};

// 		const dataCount = await FriendRequest.countDocuments(query);
// 		let result;

// 		if (!page || !limit) {
// 			result = await FriendRequest.find(query)
// 				.sort({ created_at: -1 })
// 				.exec();
// 		}

// 		if (page && limit) {
// 			limit = parseInt(limit);
// 			const offset = (parseInt(page) - 1) * limit;
// 			result = await FriendRequest.find(query)
// 				.sort({ created_at: -1 })
// 				.skip(offset)
// 				.limit(limit)
// 				.exec();
// 		}

// 		res.json({
// 			message: 'All Friend Request',
// 			status: true,
// 			count: dataCount,
// 			result,
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		res.json({
// 			message: 'Could not fetch',
// 			status: false,
// 		});
// 	}
// };

// // View all friends
// exports.viewAllFriends = async (req, res) => {
// 	try {
// 	  const { sender_id, limit, page } = req.body;
// 	  const query = {
// 		sender_id,
// 		status: 'accepted',
// 	  };
  
// 	  const dataCount = await FriendRequest.countDocuments(query);
  
// 	  let aggregationPipeline = [
// 		{
// 		  $match: query,
// 		},
// 		{
// 		  $sort: { created_at: -1 },
// 		},
// 	  ];
  
// 	  if (page && limit) {
// 		limit = parseInt(limit);
// 		const offset = (parseInt(page) - 1) * limit;
// 		aggregationPipeline.push(
// 		  {
// 			$skip: offset,
// 		  },
// 		  {
// 			$limit: limit,
// 		  }
// 		);
// 	  }
  
// 	  // Add $lookup stage to get sender and receiver information
// 	  aggregationPipeline.push(
// 		{
// 		  $lookup: {
// 			from: 'users', // Name of the User collection
// 			localField: 'sender_id',
// 			foreignField: '_id', // Assuming User's _id is used for sender_id
// 			as: 'senderInfo',
// 		  },
// 		},
// 		{
// 		  $lookup: {
// 			from: 'users', // Name of the User collection
// 			localField: 'receiver_id',
// 			foreignField: '_id', // Assuming User's _id is used for receiver_id
// 			as: 'receiverInfo',
// 		  },
// 		}
// 	  );
  
// 	  const result = await FriendRequest.aggregate(aggregationPipeline).exec();
  
// 	  res.json({
// 		message: 'All Friend Requests',
// 		status: true,
// 		count: dataCount,
// 		result,
// 	  });
// 	} catch (err) {
// 	  console.error(err);
// 	  res.json({
// 		message: 'Could not fetch',
// 		status: false,
// 	  });
// 	}
//   };

// // Helper function to get sender IDs for unfriend users
// async function getSenderIds(_id) {
// 	const requests = await FriendRequest.find({ sender_id: _id });
// 	return requests.map((request) => request.receiver_id);
// }

// // Respond to a friend request
// exports.respondToRequest = async (req, res) => {
// 	try {
// 		const { friend_request_id, status } = req.body;

// 		if (!friend_request_id) {
// 			res.json({
// 				message: 'Friend request id is required',
// 				status: false,
// 			});
// 		} else {
// 			const friendRequest = await FriendRequest.findOne({ _id: friend_request_id });

// 			if (friendRequest) {
// 				const oldStatus = friendRequest.status;

// 				if (status === undefined || status === '') {
// 					status = oldStatus;
// 				}

// 				friendRequest.status = status;
// 				const updatedFriendRequest = await friendRequest.save();

// 				res.json({
// 					message: `Friend Request ${status} Successfully!`,
// 					status: true,
// 					result: updatedFriendRequest,
// 				});
// 			} else {
// 				res.json({
// 					message: 'Friend request not found',
// 					status: false,
// 				});
// 			}
// 		}
// 	} catch (err) {
// 		console.error(err);
// 		res.json({
// 			message: 'Try Again',
// 			status: false,
// 			err,
// 		});
// 	}
// };
