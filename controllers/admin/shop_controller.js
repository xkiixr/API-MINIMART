const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../Model/respone_model");
const { genSaltSync, hashSync } = require("bcrypt");
require("dotenv").config();
module.exports = {
  ShopCreate: async (req, res) => {
    const validateKeys = ["shopId:string", "!shopName:string", "!tel","contact", "!address", "!ownerName:string", "!ownerSurname", "!gender", "!email:string",
      "!password", "latitude", "longitude", "!status", "!expire:string", "remark", "!open"];
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
    let salt = genSaltSync(10);
    result.password = hashSync(result.password, salt); // ຮັບຈາກໜ້າບ້ານແລ້ວແປງລະຫັດໃຫ້ເປັນ Bcrypt
    var image, uploadParameters;
    if (!req.file) {
      //ກວດສອບຟາຍທີ່ສົ່ງມາວ່າເປັນຄ່າວ່າງ ຫຼື ບໍ່
      image = "";
    } else {
      image = "SHOPLOGO" + "_" + Date.now() + "_" + req.file.originalname; // ຖ້າບໍ່ເປັນຄ່າວ່າງໃຫ້ຕັ້ງຕົວປ່ຽນເທົ່າກັບຊື່ຟາຍທີ່ສົ່ງມາ
      uploadParameters = {
        Bucket: process.env.BucketName,
        ContentType: req.file.mimetype,
        Body: req.file.buffer,
        ACL: "public-read",
        Key: image,
      };
    }
    const { data, statusInfo } = await query("call shop_create(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        req.userModel.result.id,
        result?.shopId,
        result?.shopName,
        result?.tel,
        result?.contact,
        result?.address,
        result?.ownerName,
        result?.ownerSurname,
        result?.gender,
        result?.email,
        result?.password,
        image,
        result?.latitude,
        result?.longitude,
        result?.status,
        result?.expire,
        result?.remark,
        result?.open
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
  ShopUpdate: async (req, res) => {
    const validateKeys = ["shopId:string", "!shopName:string", "!tel", "contact", "!address", "!ownerName:string", "!ownerSurname", "!gender", "!email:string",
      "!password", "latitude", "longitude", "!status", "!expire:string", "remark", "!open", "imageUrl"];
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
      image = "SHOPLOGO" + "_" + Date.now() + "_" + req.file.originalname; // ຖ້າບໍ່ເປັນຄ່າວ່າງໃຫ້ຕັ້ງຕົວປ່ຽນເທົ່າກັບຊື່ຟາຍທີ່ສົ່ງມາ
      uploadParameters = {
        Bucket: process.env.BucketName,
        ContentType: req.file.mimetype,
        Body: req.file.buffer,
        ACL: "public-read",
        Key: image,
      };
    }
    const { data, statusInfo } = await query("call shop_update(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        req.userModel.result.id,
        result?.shopId,
        result?.shopName,
        result?.tel,
        result?.contact,
        result?.address,
        result?.ownerName,
        result?.ownerSurname,
        result?.gender,
        result?.email,
        result?.password,
        image,
        result?.latitude,
        result?.longitude,
        result?.status,
        result?.expire,
        result?.remark,
        result?.open
      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    if (statusInfo["msg"] == "success") {
      if (req.file) {
        if (result?.imageUrl) {
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
        space.upload(uploadParameters, function (error, data) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
    return res.status(statusInfo["status"]).send({ statusInfo });
  },
  ShopDelete: async (req, res) => {
    const validateKeys = ["!id"];
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
    if (!req.body.imageUrl) {
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

    let imageURL;
    if (req.body.imageUrl) {
      imageURL = req.body.imageUrl;
      console.log(imageURL);
      console.log(imageURL.split("/"));
      imageURL = imageURL.split("/");
      imageURL = imageURL[imageURL.length - 1];
      imageURL = imageURL.trim();
      console.log("result.imageUrl: ", imageURL);
    }
    const { data, statusInfo } = await query("call shop_delete(?,?)", [
      req.userModel.result.id,
      result?.id,
    ]).catch((error) =>
      res.status(error.status).send(errorResponse({ error }))
    );
    if (statusInfo["msg"] == "success") {
      if (imageURL) {
        let params = {
          Bucket: process.env.BucketName,
          Key: imageURL,
        };
        space.deleteObject(params, function (error, data) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
    return res.status(statusInfo["status"]).send({ statusInfo });
  },
  ShopResetPassword: async (req, res) => {
    const validateKeys = ["!id", "!newpassword"];
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
    let salt = genSaltSync(10);
    result.newpassword = hashSync(result.newpassword, salt); // ຮັບຈາກໜ້າບ້ານແລ້ວແປງລະຫັດໃຫ້ເປັນ Bcrypt
    const { data, statusInfo } = await query("call shop_reset_password(?,?,?)", [
      req.userModel.result.id,
      result?.id,
      result?.newpassword,
    ]).catch((error) =>
      res.status(error.status).send(errorResponse({ error }))
    );
    return res.status(statusInfo["status"]).send({ statusInfo });
  },
  ShopView: async (req, res) => {
    const validateKeys = ["search", "!start", "!limit"];
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
    if (result.start == ":start") {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: "require start",
        })
      );
    }
    if (result.limit == ":limit") {
      return res.status(301).json(
        errorResponse({
          status: 301,
          error: true,
          msg: "require field",
          title: "ຂໍອະໄພ",
          message: "require limit",
        })
      );
    }
    const { data, statusInfo } = await query("call shop_view(?,?,?)",
      [
        "%" + result.search + "%",
        result.start,
        result.limit,
      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    return res.status(statusInfo["status"]).send({ statusInfo, data });
  },
  ShopViewAll: async (req, res) => {
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
    const { data, statusInfo } = await query("call shop_view_all(?)",
      [
        "%" + result.search + "%",
      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    return res.status(statusInfo["status"]).send({ statusInfo, data });
  },
};
