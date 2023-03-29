var express = require("express");
var router = express.Router();

const {
  verifyToken
} = require("../controllers/authentication/verify_controller");

const { GetDropdown } = require("../controllers/management/info_dropdown_controller")

/* GET home page. */
router.get("/", function (req, res, next) {
  let resp = {
    status: 200,
    message: "API Minimart",
  };
  res.json(resp);
});

router.get("/api/v1/data", verifyToken, GetDropdown);
module.exports = router;
