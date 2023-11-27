const express = require('express');
const router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "--" + file.originalname)
    }
})
const upload = multer({
    storage: storage
})
module.exports = upload
// const multer = require('multer');

// try {
//     var storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, 'uploads/')
//         },
//         filename: function (req, file, cb) {
//             cb(null, `img@_${Date.now()}`)
//         }
//     })
//     var upload = multer({ storage: storage })
//     module.exports = upload
// }
// catch (err) {
//     console.log(err);
// }