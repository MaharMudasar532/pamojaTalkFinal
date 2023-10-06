module.exports = app => {


    const CommentItem = require("../controllers/CommentItem");

    let router = require("express").Router();

    router.post("/comment_an_item", CommentItem.CommentItem);
    router.post("/delete_comment_item", CommentItem.UnCommentItem);
    router.post("/view_comments_Item",CommentItem.ViewCommentItem );
    router.post("/view_Item_comments",CommentItem.ViewItemComments );
    router.post("/ViewItemComments",CommentItem.ViewItemComments );
    router.post("/ViewItemCommentsAll",CommentItem.ViewItemCommentsAll );

    app.use("/comment", router);
};
