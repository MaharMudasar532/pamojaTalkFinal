module.exports = app => {

const Pole_options = require("../controllers/Pole_options");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add", Pole_options.create);
// router.post("/view_specific", Pole_options.viewSpecific);
// router.post("/view_all", Pole_options.viewAll);
router.put("/update",Pole_options.update);
router.delete("/delete" , Pole_options.delete)
router.delete("/deleteALLOptions" , Pole_options.deleteALLOptions)

// router.post("/search", Pole_options.search);
// router.post("/view_all_with_item_count", Pole_options.view_all_with_item_count);


app.use("/Pole_options", router);
};
