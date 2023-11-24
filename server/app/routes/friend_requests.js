module.exports = app => {

    const friend_requests = require("../controllers/friend_requests");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/send_Request", friend_requests.sendFriendRequest);
    router.delete("/remove_Request", friend_requests.remove_Request);
    router.delete("/remove_Friend", friend_requests.remove_Friend);

    router.post("/viewAll_Unfriend_Users", friend_requests.viewUnfriendedUsers);
    router.post("/viewAll_Sended_Requests", friend_requests.viewAllSentRequests);

    router.post("/viewAll_Received_Requests", friend_requests.viewAllReceivedRequests)
    router.post("/viewAll_Friends", friend_requests.viewAllFriends);

    router.post("/respond_To_Request", friend_requests.acceptFriendRequest);


    app.use("/friend_requests", router);
};
