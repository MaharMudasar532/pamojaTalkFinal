module.exports = app => {

const Pole = require("../controllers/Pole");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add", Pole.create);
router.post("/view_specific", Pole.viewSpecific);
router.post("/view_all", Pole.viewAll);
router.put("/update", Pole.update);
router.delete("/delete" , Pole.delete)
router.post("/search", Pole.search);
// router.post("/view_all_with_item_count", Pole.view_all_with_item_count);


app.use("/Pole", router);
};
