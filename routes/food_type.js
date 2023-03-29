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
    foodtypeCreate,
    foodtypeUpdate,
    foodtypeDelete,
    foodtypeView,
    foodtypeViewAll
} = require("../controllers/management/foodType/food_type_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
    let resp = {
        status: 200,
        message: "Food Type Page",
    };
    res.json(resp);
});
router.post("/create", verifyToken, foodtypeCreate);
router.put("/update/:foodTypeID", verifyToken, foodtypeUpdate);
router.delete("/delete/:foodTypeID", verifyToken, foodtypeDelete);
router.get("/view/all/:search", verifyToken, foodtypeViewAll);
router.get("/view/:search/:start/:limit", verifyToken, foodtypeView);


module.exports = router;
