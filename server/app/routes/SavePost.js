module.exports = app => {


    const SavePost = require("../controllers/SavePost");

    let router = require("express").Router();

    router.post("/save_post", SavePost.savePost);
    router.post("/un_save_post", SavePost.unsavePost);
    router.post("/view_save_post",SavePost.viewSavePost );
    router.post("/check_post",SavePost.checkPost );

    app.use("/save_post", router);
};
