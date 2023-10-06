module.exports = app => {

    const friend_requests = require("../controllers/friend_requests");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/send_Request", friend_requests.sendRequest);
    router.delete("/remove_Request", friend_requests.removeRequest);

    router.post("/viewAll_Unfriend_Users", friend_requests.viewAll_UnfriendUsers);
    router.post("/viewAll_Sended_Requests", friend_requests.viewAll_SendedRequests);

    router.post("/viewAll_Received_Requests", friend_requests.viewAll_ReceivedRequests)
    router.post("/viewAll_Friends", friend_requests.viewAllFriends);

    router.post("/respond_To_Request", friend_requests.respondToRequest);


    app.use("/friend_requests", router);
};
