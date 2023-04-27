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
    importCreate,
    importUpdate,
    importView,
    importViewAll
} = require("../controllers/management/import/import_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "Import Page",
    };
    res.json(resp);
});
 router.post("/create", verifyToken, importCreate);
 router.put("/update/:importID", verifyToken, importUpdate);
// router.delete("/delete/:cateID", verifyToken, categoryDelete);
 router.get("/view/all/:search", verifyToken, importViewAll);
router.get("/view/:search/:start/:limit", verifyToken, importView);


module.exports = router;
