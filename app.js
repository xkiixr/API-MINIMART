var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const httpLogger = require("./httpLogger");
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");
var serve = serveStatic("api/v1/logs/");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authenRouter = require("./routes/authen");
var adminRouter = require("./routes/admin");
var accountShopRouter = require("./routes/accout_shop");
var exchangeRouter = require("./routes/exchange");
var categoryRouter = require("./routes/category")
var unitRouter = require("./routes/unit");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(httpLogger);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/v1/username", usersRouter);
app.use("/api/v1/authorization/", authenRouter);
app.use("/api/v1/admin/", adminRouter);
app.use("/api/v1/exchange", exchangeRouter);
app.use("/api/v1/logs/", express.static(__dirname + "/logs/", { icons: true }));
app.use("/api/v1/logs/", serveIndex(__dirname + "/logs", { icons: true }));
app.use("/api/v1/accountshop", accountShopRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/unit", unitRouter);


// catch 404 and forward to error handler

app.get("*", function (req, res) {
  let resp = {
    status: 404,
    msg: "path not found",
  };
  res.status(404).send(resp);
});
app.post("*", function (req, res) {
  let resp = {
    status: 404,
    msg: "path not found",
  };
  res.status(404).send(resp);
});
app.put("*", function (req, res) {
  let resp = {
    status: 404,
    msg: "path not found",
  };
  res.status(404).send(resp);
});
app.patch("*", function (req, res) {
  let resp = {
    status: 404,
    msg: "path not found",
  };
  res.status(404).send(resp);
});
app.delete("*", function (req, res) {
  let resp = {
    status: 404,
    msg: "path not found",
  };
  res.status(404).send(resp);
});

app.use("/", (req, res, next) => {
  let requestMethod = req.method;
  console.log(requestMethod);
  let resp = {
    status: 404,
    msg: "method: " + requestMethod + " path not found",
  };
  res.status(404).send(resp);
});
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
