module.exports = app => {

const vote_pole = require("../controllers/vote_pole");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add", vote_pole.votePole);
// router.post("/view_specific", vote_pole.viewSpecific);
// router.post("/view_all", vote_pole.viewAll);
// router.put("/update",upload.single('vote_pole_image'), vote_pole.update);
// router.delete("/delete" , vote_pole.delete)
// router.post("/search", vote_pole.search);
// router.post("/view_all_with_item_count", vote_pole.view_all_with_item_count);


app.use("/vote_pole", router);
};
