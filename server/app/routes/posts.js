module.exports = app => {

    const posts = require("../controllers/posts");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add", upload.array('images'), posts.create);
    router.post("/view_specific", posts.viewSpecific);
    router.post("/view_all", posts.viewAll);
    router.post("/getYears", posts.getYears);
    router.post("/getAllUsers_MonthWise_count", posts.getAllUsers_MonthWise_count);

    router.put("/update", upload.array('images'), posts.update);
    router.delete("/delete", posts.delete)
    router.delete("/DeleteImage", posts.DeleteImage)

    router.post("/view_user_all_posts", posts.view_user_all_posts);
    router.post("/view_friends_users_posts", posts.view_friends_users_posts);



    app.use("/posts", router);
};
