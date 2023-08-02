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
    supplyCreate, supplyUpdate, supplyDelete, supplyView, supplyViewAll

} = require("../controllers/management/supply/supply_controller");
const { MarketplaceEntitlementService } = require("aws-sdk");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "User Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, supplyCreate);
router.put("/update/:supplyID", verifyToken, supplyUpdate);
router.delete("/delete/:supplyID", verifyToken, supplyDelete);

router.get("/view/all/:search", verifyToken, supplyViewAll)
router.get("/view/:search/:start/:limit", verifyToken, supplyView)
// router.get("/view/:search", verifyToken, AccountShopView);

module.exports = router;
