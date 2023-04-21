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
    customerCreate,
    customerUpdate,
    customerDelete,
    customerView,
    customerViewAll

} = require("../controllers/management/customer/customer_contrller");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "User Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, upload.single("profile"), errHandler, customerCreate);
router.put("/update/:cusID", verifyToken, upload.single("profile"), errHandler, customerUpdate);
router.delete("/delete/:cusID", verifyToken, upload.single("profile"), errHandler, customerDelete);

router.get("/view/all/:search", verifyToken, customerViewAll)
router.get("/view/:search/:start/:limit", verifyToken, customerView)
// router.get("/view/:search", verifyToken, AccountShopView);

module.exports = router;
