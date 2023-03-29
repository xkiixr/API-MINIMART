const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");

require("dotenv").config();
module.exports = {
  AccountShopCreate: async (req, res) => {
    const validateKeys = ["!bankID", "!curID", "!accountNo", "!accountName"];
    const [isValid, logs, result] = useValidate(validateKeys, req.body);
    if (isValid) {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: logs[0],
        })
      );
    }

    var image, uploadParameters;
    if (!req.file) {
      //ກວດສອບຟາຍທີ່ສົ່ງມາວ່າເປັນຄ່າວ່າງ ຫຼື ບໍ່
      image = "";
    } else {
      image = req.file.fieldname + "_" + Date.now() + "_" + req.file.originalname; // ຖ້າບໍ່ເປັນຄ່າວ່າງໃຫ້ຕັ້ງຕົວປ່ຽນເທົ່າກັບຊື່ຟາຍທີ່ສົ່ງມາ
      uploadParameters = {
        Bucket: process.env.BucketName,
        ContentType: req.file.mimetype,
        Body: req.file.buffer,
        ACL: "public-read",
        Key: image,
      };
    }
    const { data, statusInfo } = await query("call account_shop_create(?,?,?,?,?,?,?)",
      [
        req.userModel.result.id,
        req.userModel.result.shop_id,
        result?.bankID,
        result?.curID,
        result?.accountNo,
        result?.accountName,
        image
      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    if (statusInfo["msg"] == "success") {
      if (req.file) {
        space.upload(uploadParameters, function (error, data) {
          if (error) {
            console.log("\n", error, "\n");
          }
        });
      }
    }
    return res.status(statusInfo["status"]).send({ statusInfo });
  },
  AccountShopCreate: async (req, res) => {
    const validateKeys = ["!bankID", "!curID", "!accountNo", "!accountName"];
    const [isValid, logs, result] = useValidate(validateKeys, req.body);
    if (isValid) {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: logs[0],
        })
      );
    }

    var image, uploadParameters;
    if (!req.file) {
      //ກວດສອບຟາຍທີ່ສົ່ງມາວ່າເປັນຄ່າວ່າງ ຫຼື ບໍ່
      image = "";
    } else {
      image = req.file.fieldname + "_" + Date.now() + "_" + req.file.originalname; // ຖ້າບໍ່ເປັນຄ່າວ່າງໃຫ້ຕັ້ງຕົວປ່ຽນເທົ່າກັບຊື່ຟາຍທີ່ສົ່ງມາ
      uploadParameters = {
        Bucket: process.env.BucketName,
        ContentType: req.file.mimetype,
        Body: req.file.buffer,
        ACL: "public-read",
        Key: image,
      };
    }
    const { data, statusInfo } = await query("call account_shop_create(?,?,?,?,?,?,?)",
      [
        req.userModel.result.id,
        req.userModel.result.shop_id,
        result?.bankID,
        result?.curID,
        result?.accountNo,
        result?.accountName,
        image
      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    if (statusInfo["msg"] == "success") {
      if (req.file) {
        space.upload(uploadParameters, function (error, data) {
          if (error) {
            console.log("\n", error, "\n");
          }
        });
      }
    }
    return res.status(statusInfo["status"]).send({ statusInfo });
  },
  AccountShopUpdate: async (req, res) => {
    const validateKeys = ["accID", "!bankID", "!curID", "!accountNo", "!accountName", "imageUrl"];
    const [isValid, logs, result] = useValidate(validateKeys, req.body);
    if (isValid) {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: logs[0],
        })
      );
    }
    var image, uploadParameters;
    if (result.imageUrl) {
      console.log(result.imageUrl);
      console.log(result.imageUrl.split("/"));
      result.imageUrl = result.imageUrl.split("/");
      result.imageUrl = result.imageUrl[result.imageUrl.length - 1];
      console.log("result.imageUrl: ", result.imageUrl);
    }
    if (!req.file) {
      //ກວດສອບຟາຍທີ່ສົ່ງມາວ່າເປັນຄ່າວ່າງ ຫຼື ບໍ່
      image = result.imageUrl;
    } else {
      image = req.file.fieldname + "_" + Date.now() + "_" + req.file.originalname; // ຖ້າບໍ່ເປັນຄ່າວ່າງໃຫ້ຕັ້ງຕົວປ່ຽນເທົ່າກັບຊື່ຟາຍທີ່ສົ່ງມາ
      uploadParameters = {
        Bucket: process.env.BucketName,
        ContentType: req.file.mimetype,
        Body: req.file.buffer,
        ACL: "public-read",
        Key: image,
      };
    }
    const { data, statusInfo } = await query("call account_shop_update(?,?,?,?,?,?,?,?)",
      [
        req.userModel.result.id,
        req.userModel.result.shop_id,
        result?.accID,
        result?.bankID,
        result?.curID,
        result?.accountNo,
        result?.accountName,
        image
      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    if (statusInfo["msg"] == "success") {
      if (req.file) {
        let params = {
          Bucket: process.env.BucketName,
          Key: result?.imageUrl,
        };
        space.deleteObject(params, function (error, data) {
          if (error) {
            console.log(error);
          }
        });
        space.upload(uploadParameters, function (error, data) {
          if (error) {
            console.log("\n", error, "\n");
          }
        });
      }
    }
    return res.status(statusInfo["status"]).send({ statusInfo, data });
  },
  AccountShopDelete: async (req, res) => {
    const accID = req.params.accID
    const validateKeys = ["imageUrl"];
    const [isValid, logs, result] = useValidate(validateKeys, req.body);
    if (isValid) {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: logs[0],
        })
      );
    }
    if (!result.imageUrl) {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: "require body value imageUrl",
        })
      );
    }
    if (accID == ":accID") {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: "require accID",
        })
      );
    }
    if (result.imageUrl) {
      console.log(result.imageUrl);
      console.log(result.imageUrl.split("/"));
      result.imageUrl = result.imageUrl.split("/");
      result.imageUrl = result.imageUrl[result.imageUrl.length - 1];
      console.log("result.imageUrl: ", result.imageUrl);
    }
    const { data, statusInfo } = await query("call account_shop_delete(?,?,?)",
      [
        req.userModel.result.id,
        req.userModel.result.shop_id,
        accID

      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    if (statusInfo["msg"] == "success") {
      if (req.file) {
        let params = {
          Bucket: process.env.BucketName,
          Key: result?.imageUrl,
        };
        space.deleteObject(params, function (error, data) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
    return res.status(statusInfo["status"]).send({ statusInfo, data });
  },


  AccountShopView: async (req, res) => {
    const validateKeys = ["search"];
    const [isValid, logs, result] = useValidate(validateKeys, req.params);
    if (isValid) {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: logs[0],
        })
      );
    }
    if (result.search == ":search") {
      result.search = "";
    }

    const { data, statusInfo } = await query("call account_shop_view(?,?)",
      [
        req.userModel.result.shop_id,
        "%" + result.search + "%",
      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    return res.status(statusInfo["status"]).send({ statusInfo, data });
  },
  UsernameViewAll: async (req, res) => {
    const validateKeys = ["search"];
    const [isValid, logs, result] = useValidate(validateKeys, req.params);
    if (isValid) {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: logs[0],
        })
      );
    }
    if (result.search == ":search") {
      result.search = "";
    }
    const { data, statusInfo } = await query("call username_view_all(?,?)",
      [
        req.userModel.result.shop_id,
        "%" + result.search + "%",
      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    return res.status(statusInfo["status"]).send({ statusInfo, data });
  },
};
