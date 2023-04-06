var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000,
  },
});

function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      success: 0,
      message: err.message
    })
  }
};
const {
  verifyToken
} = require("../controllers/authentication/verify_controller");
const {
  UserCreate, UserUpdate, UserUpdateProfile, UserDelete, UserResetPassword, UserChangePassword, UsernameView, UsernameViewAll
} = require("../controllers/management/username/user_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
  let resp = {
    status: 200,
    message: "User Page",
  };
  res.json(resp);
});
router.post("/create", upload.single("profile"), errHandler, UserCreate);
router.put("/update", verifyToken, upload.single("profile"), errHandler, UserUpdate);
// router.post("/profile/update", verifyToken, upload.single("profile"), errHandler, UserUpdateProfile);
router.delete("/delete/:id", verifyToken, UserDelete);
router.post("/resetPassword", UserResetPassword);

router.post("/change/password", verifyToken, UserChangePassword);


router.get("/view/:search/:start/:limit", verifyToken, UsernameView);
router.get("/viewall/:search", verifyToken, UsernameViewAll);

module.exports = router;
