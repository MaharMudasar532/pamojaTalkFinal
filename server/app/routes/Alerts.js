module.exports = app => {

const Alerts = require("../controllers/Alerts");
const upload = require("../middlewares/FolderImagesMulter")

let router = require("express").Router();

router.post("/add",upload.single('alert_image'), Alerts.create);
router.post("/view_specific", Alerts.viewSpecific);
router.post("/view_all", Alerts.viewAll);
router.put("/update",upload.single('alert_image'), Alerts.update);
router.delete("/delete" , Alerts.delete)
router.post("/search", Alerts.search);
router.post("/check_near_by_private", Alerts.checkNearBy_private);
router.post("/check_near_by_public", Alerts.checkNearBy_public);


app.use("/alert", router);
};
