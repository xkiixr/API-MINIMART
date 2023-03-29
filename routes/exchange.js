var express = require("express");
var router = express.Router();

const {
    verifyToken
} = require("../controllers/authentication/verify_controller");
const {
    ExchangeCreate, ExchangeUpdate, ExchangeDelete,ExchangeView
} = require("../controllers/management/exchange/exchange_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "User Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, ExchangeCreate);
router.put("/update", verifyToken, ExchangeUpdate);
router.delete("/delete/:id", verifyToken, ExchangeDelete);
router.get("/view/:search", verifyToken, ExchangeView);

module.exports = router;
