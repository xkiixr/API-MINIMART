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
    categoryCreate,
    categoryUpdate,
    categoryDelete,
    categoryView,
    categoryViewAll
} = require("../controllers/management/category/category");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "Category Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, categoryCreate);
router.put("/update/:cateID", verifyToken, categoryUpdate);
router.delete("/delete/:cateID", verifyToken, categoryDelete);
router.get("/view/all/:search", verifyToken, categoryViewAll);
router.get("/view/:search/:start/:limit", verifyToken, categoryView);


module.exports = router;
