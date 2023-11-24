module.exports = app => {


    const CommentPost = require("../controllers/CommentPost");

    let router = require("express").Router();

    router.post("/comment_a_post", CommentPost.CommentPost);
    router.post("/delete_comment_post", CommentPost.UnCommentPost);
    router.post("/view_comments_post", CommentPost.ViewCommentPost);
    router.post("/view_post_comments", CommentPost.ViewPostComments);
    router.post("/View_postComments", CommentPost.ViewPostComments);
    router.post("/View_postComments_All", CommentPost.ViewPostCommentsAll);

    app.use("/comment", router);
};
