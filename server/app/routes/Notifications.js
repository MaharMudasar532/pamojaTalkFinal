module.exports = app => {

    const Notification = require("../controllers/Notification");

    let router = require("express").Router();

    router.post("/add", Notification.create);
    router.post("/view_specific", Notification.viewSpecific);
    router.post("/view_all", Notification.viewAll);
    router.delete("/delete", Notification.delete)


    app.use("/Notifications", router);
};
