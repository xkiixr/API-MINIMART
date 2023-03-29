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
    AccountShopCreate,
    AccountShopDelete,
    AccountShopUpdate,
    AccountShopView
} = require("../controllers/management/accountShop/account_shop_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "User Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, upload.single("qrcode"), errHandler, AccountShopCreate);
router.put("/update", verifyToken, upload.single("qrcode"), errHandler, AccountShopUpdate);
router.delete("/delete/:accID", verifyToken, upload.single("qrcode"), errHandler, AccountShopDelete);
router.get("/view/:search", verifyToken, AccountShopView);

module.exports = router;
