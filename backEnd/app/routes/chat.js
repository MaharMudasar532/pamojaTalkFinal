const express = require('express');

const {
    getChats,
    newChat,
    deleteChat,
} = require('../controllers/chat');

const router = express.Router();

router.get('/', getChats)
router.post('/new', newChat)
router.delete('/delete/:id',  deleteChat)

module.exports = router;














// module.exports = app => {

// const chat = require("../controllers/chat");
// const upload = require("../middlewares/FolderImagesMulter")

// let router = require("express").Router();

// router.post("/send",upload.single('chat_image'), chat.create);
// router.post("/view_specific", chat.viewSpecific);
// router.post("/view_all", chat.viewAll);
// router.put("/update",upload.single('chat_image'), chat.update);
// router.delete("/delete" , chat.delete)
// router.post("/search", chat.search);


// app.use("/chat", router);
// };
