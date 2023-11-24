const Chat = require('../models/chat.js');
const Message = require('../models/message.js');
const User = require('../models/user.js');

async function getChats(req, res) {
  const { users } = req.body;
  try {

    let filter = { users: users };
    const messages = await Chat.find(filter)
      .sort({ createdAt: -1 });


    res.json({
      result: messages,
      status: true,
      message: "Chat Room for 2 Users",
    });



  } catch (err) {
    res.json({
      status: false,
      message: err.message,
    });
  }
}

async function newChat(req, res) {
  const { users } = req.body;

  if (!users || users.length === 0) return res.json({ status: false, message: 'Users are missing' });
  if (users.length < 2) return res.json({ status: false, message: 'At least 2 users are required to initiate a chat' });
  if (hasDuplicates(users)) return res.json({ status: false, message: 'Duplicate users are not allowed' });

  try {
    // Find if users exist
    const existingUsers = await User.find({ _id: { $in: users } });

    if (!existingUsers || existingUsers.length < 2) {
      return res.json({
        status: false,
        message: 'One or more users were not found',
      });
    }

    // Find existing chat between the users
    const existingChat = await Chat.findOne({ users: { $all: users } });

    if (existingChat) {
      return res.json(existingChat);
    }

    // Initiate Chat
    const newChat = await Chat.create({ users });

    res.json({
      status: true,
      message: 'Created',
      result: newChat,
    });
  } catch (err) {
    res.json({
      status: false,
      message: err.message,
    });
  }
}

async function deleteChat(req, res) {
  const { id } = req.params;

  try {
    // Check if the chat exists
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.json({
        status: false,
        message: 'Chat does not exist for the specified ID',
      });
    }

    // Delete the chat
    await chat.deleteOne();

    res.json({
      status: true,
      message: 'Chat deleted successfully',
      result: chat,
    });
  } catch (err) {
    res.json({
      status: false,
      message: err.message,
    });
  }
}

function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}



module.exports = {
  getChats,
  newChat,
  deleteChat,
};
