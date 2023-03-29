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
      unitCreate,
      unitUpdate,
      unitDelete,
      unitView,
      unitViewAll
} = require("../controllers/management/unit/unit_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "Unit Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, unitCreate);
router.put("/update/:unitID", verifyToken, unitUpdate);
router.delete("/delete/:unitID", verifyToken, unitDelete);
router.get("/view/all/:search", verifyToken, unitViewAll);
router.get("/view/:search/:start/:limit", verifyToken, unitView);


module.exports = router;
