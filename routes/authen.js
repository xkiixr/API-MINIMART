var express = require("express");
var router = express.Router();
const {
  Signin,
  RefreshToken,
} = require("../controllers/authentication/authen_controller");
const {
  CheckPassKey,
  CheckPassKeyID,
  CheckValidateToken,
  verifyToken
} = require("../controllers/authentication/verify_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
  let resp = {
    status: 200,
    message: "Authentication Page",
  };
  res.json(resp);
});
router.post("/login", CheckPassKey, Signin);
// router.post("/login", Signin);
router.post("/refreshToken", CheckPassKeyID, RefreshToken);
router.get("/validateToken", CheckValidateToken);

module.exports = router;
