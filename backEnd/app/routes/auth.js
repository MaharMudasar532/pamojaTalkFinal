module.exports = app => {
  const Auth = require("../controllers/user");
  const otp = require("../controllers/otp");

  var router = require("express").Router();
  const upload = require("../middlewares/FolderImagesMulter")

  router.post("/sign_up", upload.single('image'), Auth.signUp);
  router.post("/sign_in", Auth.sign_in);
  router.put("/update_profile", upload.single('image'), Auth.updateProfile);
  router.post("/getUser", Auth.SpecificUser)
  router.post("/AllUsers_Count", Auth.AllUsers_Count)
  router.put("/updatedPassword", Auth.passwordReset);
  router.post("/verifyEmail", otp.VerifyEmail);
  router.post("/verifyOTP", otp.verifyOTP)
  router.post("/newPassword", Auth.newPassword)
  router.post("/total_users", Auth.AllUsers)
  router.delete("/delete_user", Auth.DeleteUser)
  router.post("/getDistance", Auth.getDistance)
  router.post("/get_users_in_a_range", Auth.getUsers_inRange)

  app.use('/user', router);
};