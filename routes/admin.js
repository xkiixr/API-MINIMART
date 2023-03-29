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
  ShopCreate, ShopUpdate, ShopDelete,ShopResetPassword, ShopView, ShopViewAll
} = require("../controllers/admin/shop_controller");
const {
  verifyToken
} = require("../controllers/authentication/verify_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
  let resp = {
    status: 200,
    message: "Admin Page",
  };
  res.json(resp);
});
router.post("/shop/create", verifyToken, upload.single("logo"), errHandler, ShopCreate);
router.put("/shop/update", verifyToken, upload.single("logo"), errHandler, ShopUpdate);
router.delete("/shop/delete/:id", verifyToken, ShopDelete);
router.post("/shop/reset/password", verifyToken, ShopResetPassword);
router.get("/shop/view/:search/:start/:limit", verifyToken, upload.single("logo"), errHandler, ShopView);
router.get("/shop/view/:search", verifyToken, upload.single("logo"), errHandler, ShopViewAll);

module.exports = router;
