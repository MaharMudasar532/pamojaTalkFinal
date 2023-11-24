const express = require('express');
const {
    getMessages,
    newMessage,
    updateMessages,
} = require('../controllers/message');
const upload = require("../middlewares/FolderImagesMulter")
const router = express.Router();

router.get('/:chatID', getMessages)
router.put('/update/:chatID', updateMessages)
router.post(
    '/new/:chatID',
    upload.array('images'),
    newMessage
)

module.exports = router;