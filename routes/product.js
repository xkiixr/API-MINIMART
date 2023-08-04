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
    verifyToken,
} = require("../controllers/authentication/verify_controller");
const {
    productView,
    productViewAll,
    productViewBarcode,
    productViewcateID,
    productCreate,
    productUpdate,
    productUpdateDetail,
    productDelete
} = require("../controllers/management/product/product_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "Category Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, productCreate);
router.put("/update/:productID", verifyToken, productUpdate);
router.put("/detail/update/:productID", verifyToken, productUpdateDetail);
router.delete("/delete/:productID", verifyToken, productDelete);
router.get("/view/all/:search", verifyToken, productViewAll);
router.get("/view/:search/:start/:limit", verifyToken, productView);
router.get("/view-by/:Barcode", verifyToken, productViewBarcode);
router.get("/view-by/cateID/:search/:cateID", verifyToken, productViewcateID);


module.exports = router;
