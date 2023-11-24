module.exports = app => {

const item = require("../controllers/item");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add",upload.array('images'), item.create);
router.post("/view_specific", item.viewItem);
router.post("/view_all", item.viewAll);
router.put("/update",upload.array('images'), item.update);
router.delete("/delete" , item.delete)
router.delete("/DeleteImage" , item.DeleteImage)
router.post("/search", item.search);
router.post("/viewItem_By_Category", item.viewItem_By_Category);
router.post("/viewItem_By_Category_count", item.viewItem_By_Category_count);


app.use("/item", router);
};
