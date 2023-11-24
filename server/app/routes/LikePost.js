module.exports = app => {


    const LikePost = require("../controllers/LikePost");

    let router = require("express").Router();

    router.post("/like_post", LikePost.likePost);
    router.post("/un_like_post", LikePost.unlikePost);
    router.post("/view_like_post",LikePost.viewLikePost );
    router.post("/view_post_likes",LikePost.viewPostLikes );
    router.post("/CheckPost",LikePost.checkPost );

    app.use("/like_post", router);
};
