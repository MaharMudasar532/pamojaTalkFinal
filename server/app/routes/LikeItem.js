module.exports = app => {


    const LikeItem = require("../controllers/LikeItem");

    let router = require("express").Router();

    router.post("/like_item", LikeItem.likeItem);
    router.post("/un_like_item", LikeItem.unlikeItem);
    router.post("/view_like_Item",LikeItem.viewLikeItem );
    router.post("/view_Item_likes",LikeItem.viewItemLikes );
    router.post("/CheckItem",LikeItem.checkItem );

    app.use("/like_item", router);
};
