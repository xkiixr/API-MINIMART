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
    menuCreate,
    menuUpdate,
    menuDelete,
    MenuView,
    MenuViewAll
} = require("../controllers/management/menu/menu_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "User Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, upload.single("foodImage"), errHandler, menuCreate);
router.put("/update/:foodID", verifyToken, upload.single("foodImage"), errHandler, menuUpdate);
router.delete("/delete/:foodID", verifyToken, menuDelete);
router.get("/view/all/:search", verifyToken, MenuViewAll);
router.get("/view/:search/:start/:limit", verifyToken, MenuView);


module.exports = router;
