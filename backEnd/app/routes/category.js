module.exports = app => {

const category = require("../controllers/category");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add",upload.single('category_image'), category.create);
router.post("/view_specific", category.viewSpecific);
router.post("/view_all", category.viewAll);
router.put("/update",upload.single('category_image'), category.update);
router.delete("/delete" , category.delete)
router.post("/search", category.search);
router.post("/view_all_with_item_count", category.view_all_with_item_count);


app.use("/category", router);
};
