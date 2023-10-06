module.exports = app => {

const Ads = require("../controllers/Ads");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add",upload.single('image'), Ads.Add);
router.put("/add_image",upload.single('image'), Ads.addImage);

router.post("/view_specific", Ads.Get);
router.post("/view_all", Ads.GetAll);
router.put("/update",upload.single('image'), Ads.Update);
router.delete("/delete" , Ads.Delete)


app.use("/ads", router);
};
