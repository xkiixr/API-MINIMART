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
    tableCreate,
    tableUpdate,
    tableDelete,
    tableView,
    tableViewAll
} = require("../controllers/management/table/table_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "Category Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, tableCreate);
router.put("/update/:tableID", verifyToken, tableUpdate);
router.delete("/delete/:tableID", verifyToken, tableDelete);
router.get("/view/all/:search", verifyToken, tableViewAll);
router.get("/view/:search/:start/:limit", verifyToken, tableView);


module.exports = router;
