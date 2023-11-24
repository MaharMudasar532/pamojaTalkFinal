const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

const { sendMessage } = require('../config/socket');

async function sendUpdateChat(chatID, user) {
  try {
    // Retrieve chat information with messages and users
    const chat = await Chat.findById(chatID)
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          select: 'name imageURL',
        },
      })
      .populate('users', 'name imageURL');

    if (chat) {
      sendMessage(user.socketID, 'chat', chat);
    }
  } catch (error) {
    // Handle errors here
    console.error(error);
  }
}

async function getMessages(req, res) {
  try {
    const { chatID } = req.params;
    const { text } = req.query;

    let filter = { chat: chatID };
    if (text) {
      filter.text = { $regex: text, $options: 'i' };
    }

    const messages = await Message.find(filter)
      .populate('sender', 'name imageURL')
      .sort({ createdAt: -1 });

    // Pagination parameters
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of items per page
    const skip = (page - 1) * limit; // Number of items to skip

    const totalMessages = messages.length;
    const totalPages = Math.ceil(totalMessages / limit);

    // Slice messages based on pagination parameters
    const paginatedMessages = messages.slice(skip, skip + limit);

    res.json({
      messages: paginatedMessages,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    // Handle errors here
    console.error(error);
    // Send an error response
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function newMessage(req, res) {
  try {
    const { chatID } = req.params;
    const { text } = req.body;
    const { images } = req.files;
    if (!text && !images) {
      return error(res, 'Message cannot be empty.');
    }

    // Create a new message
    const message = new Message({
      chat: chatID,
      sender: req.body.user_id,
      text: text || '',
      images: req.files ? req.files.map((image) => ({ url: image.path })) : [],
    });

    const savedMessage = await message.save();

    if (savedMessage) {
      const sender = {
        name: req.body.name,
        _id: req.body.user_id,
      };

      // Send updates to chat users
      const chat = await Chat.findById(chatID);
      if (chat) {
        chat.users.forEach((user) => {
          console.log(user)
          sendUpdateChat(chatID, user);
          sendMessage(user.socketID, 'message', { ...savedMessage.toObject(), sender });
        });
      }

      res.send(savedMessage);
    } else {
      return error(res, 'Failed to create a new message.');
    }
  } catch (error) {
    // Handle errors here
    console.error(error);
    // Send an error response
    res.status(500).json({ error: 'An error occurred' });
  }
}
async function updateMessages(req, res) {
  try {
    const { chatID } = req.params;
    const { status } = req.body;

    // Update messages with the specified status
    const updatedMessages = await Message.updateMany(
      { chat: chatID, sender: { $ne: req.user.id }, status: { $ne: 'Seen' } },
      { $set: { status: status } }
    );

    // Send updates to chat users
    const chat = await Chat.findById(chatID);
    if (chat) {
      chat.users.forEach((user) => {
        sendUpdateChat(chatID, user);

        if (user.id !== req.user.id) {
          sendMessage(user.socketID, 'messageStatus', status);
        }
      });
    }

    res.send(updatedMessages);
  } catch (error) {
    // Handle errors here
    console.error(error);
    // Send an error response
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  sendUpdateChat,
  getMessages,
  newMessage,
  updateMessages,
};
