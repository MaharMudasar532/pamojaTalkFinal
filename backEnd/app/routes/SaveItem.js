module.exports = app => {


    const SaveItem = require("../controllers/SaveItem");

    let router = require("express").Router();

    router.post("/save_item", SaveItem.saveItem);
    router.post("/un_save_item", SaveItem.unsaveItem);
    router.post("/view_save_Item",SaveItem.viewSaveItem );
    router.post("/check_item",SaveItem.checkItem );

    app.use("/save_item", router);
};
