const express = require('express');

const {
    getChats,
    newChat,
    deleteChat,
} = require('../controllers/chat');

const router = express.Router();

router.post('/', getChats)
router.post('/new', newChat)
router.delete('/delete/:id',  deleteChat)

module.exports = router;