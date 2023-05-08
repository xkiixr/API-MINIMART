const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");
const { genSaltSync, hashSync } = require("bcrypt");
const { CheckPass } = require("./user_function");
require("dotenv").config();
module.exports = {
  UserCreate: async (req, res) => {
    const validateKeys = ["usernameid", "!name", "surname", "!gender", "!tel", "email", "!password", "!status"];
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
      image = req.file.fieldname + "_" + Date.now() + "_" + req.file.originalname; // ຖ້າບໍ່ເປັນຄ່າວ່າງໃຫ້ຕັ້ງຕົວປ່ຽນເທົ່າກັບຊື່ຟາຍທີ່ສົ່ງມາ
      uploadParameters = {
        Bucket: process.env.BucketName,
        ContentType: req.file.mimetype,
        Body: req.file.buffer,
        ACL: "public-read",
        Key: image,
      };
    }
    console.log(result);
    const { data, statusInfo } = await query("call username_create(?,?,?,?,?,?,?,?,?,?,?)",
      [
        req.userModel.result.id,
        req.userModel.result.shop_id,
        result?.usernameid,
        result?.name,
        result?.surname,
        result?.gender,
        result?.tel,
        result?.email,
        result?.password,
        result?.status,
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
  UserUpdate: async (req, res) => {
    const validateKeys = ["!id", "usernameid", "!name", "surname", "!gender", "!tel", "email", "!status", "imageUrl"];
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
    // if (result.imageUrl) {
    //   console.log(result.imageUrl);
    //   console.log(result.imageUrl.split("/"));
    //   result.imageUrl = result.imageUrl.split("/");
    //   result.imageUrl = result.imageUrl[result.imageUrl.length - 1];
    //   console.log("result.imageUrl: ", result.imageUrl);
    // }
    // if (!req.file) {
    //   //ກວດສອບຟາຍທີ່ສົ່ງມາວ່າເປັນຄ່າວ່າງ ຫຼື ບໍ່
    //   image = result.imageUrl;
    // } else {
    //   image = req.file.fieldname + "_" + Date.now() + "_" + req.file.originalname; // ຖ້າບໍ່ເປັນຄ່າວ່າງໃຫ້ຕັ້ງຕົວປ່ຽນເທົ່າກັບຊື່ຟາຍທີ່ສົ່ງມາ
    //   uploadParameters = {
    //     Bucket: process.env.BucketName,
    //     ContentType: req.file.mimetype,
    //     Body: req.file.buffer,
    //     ACL: "public-read",
    //     Key: image,
    //   };
    // }
    image = result.imageUrl;
    const { data, statusInfo } = await query("call username_update(?,?,?,?,?,?,?,?,?,?,?)",
      [
        req.userModel.result.id,
        req.userModel.result.shop_id,
        result?.id,
        result?.usernameid,
        result?.name,
        result?.surname,
        result?.gender,
        result?.tel,
        result?.email,
        result?.status,
        image
      ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    if (statusInfo["msg"] == "success") {
      // if (req.file) {
      //   let params = {
      //     Bucket: process.env.BucketName,
      //     Key: result?.imageUrl,
      //   };
      //   space.deleteObject(params, function (error, data) {
      //     if (error) {
      //       console.log(error);
      //     }
      //   });
      //   space.upload(uploadParameters, function (error, data) {
      //     if (error) {
      //       console.log("\n", error, "\n");
      //     }
      //   });
      // }
    }
    return res.status(statusInfo["status"]).send({ statusInfo });
  },
  // UserUpdateProfile: async (req, res) => {
  //   const validateKeys = ["!name", "surname", "!gender", "imageUrl"];
  //   const [isValid, logs, result] = useValidate(validateKeys, req.body);
  //   if (isValid) {
  //     return res.status(301).json(
  //       errorResponse({
  //         status: 301,
  //         error: true,
  //         msg: "require field",
  //         title: "ຂໍອະໄພ",
  //         message: logs[0],
  //       })
  //     );
  //   }
  //   var image, uploadParameters;
  //   // if (result.imageUrl) {
  //   //   console.log(result.imageUrl);
  //   //   console.log(result.imageUrl.split("/"));
  //   //   result.imageUrl = result.imageUrl.split("/");
  //   //   result.imageUrl = result.imageUrl[result.imageUrl.length - 1];
  //   //   console.log("result.imageUrl: ", result.imageUrl);
  //   // }
  //   // if (!req.file) {
  //   //   //ກວດສອບຟາຍທີ່ສົ່ງມາວ່າເປັນຄ່າວ່າງ ຫຼື ບໍ່
  //   //   image = result.imageUrl;
  //   // } else {
  //   //   image = req.file.fieldname + "_" + Date.now() + "_" + req.file.originalname; // ຖ້າບໍ່ເປັນຄ່າວ່າງໃຫ້ຕັ້ງຕົວປ່ຽນເທົ່າກັບຊື່ຟາຍທີ່ສົ່ງມາ
  //   //   uploadParameters = {
  //   //     Bucket: process.env.BucketName,
  //   //     ContentType: req.file.mimetype,
  //   //     Body: req.file.buffer,
  //   //     ACL: "public-read",
  //   //     Key: image,
  //   //   };
  //   // }
  //   image = result.imageUrl;
  //   const { data, statusInfo } = await query("call username_update(?,?,?,?,?,?)",
  //     [
  //       req.userModel.result.id,
  //       req.userModel.result.shop_id,
  //       result?.name,
  //       result?.surname,
  //       result?.gender,
  //       image
  //     ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
  //   if (statusInfo["msg"] == "success") {
  //     if (req.file) {
  //       let params = {
  //         Bucket: process.env.BucketName,
  //         Key: result?.imageUrl,
  //       };
  //       space.deleteObject(params, function (error, data) {
  //         if (error) {
  //           console.log(error);
  //         }
  //       });
  //       space.upload(uploadParameters, function (error, data) {
  //         if (error) {
  //           console.log("\n", error, "\n");
  //         }
  //       });
  //     }
  //   }
  //   return res.status(statusInfo["status"]).send({ statusInfo, data });
  // },
  UserDelete: async (req, res) => {
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
    const { data, statusInfo } = await query("call username_delete(?,?,?)", [
      req.userModel.result.id,
      req.userModel.result.shop_id,
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
  UserResetPassword: async (req, res) => {
    const validateKeys = ["!id:number", "!newpassword"];
    const [isValid, logs, result] = useValidate(validateKeys, req.body);
    console.log(result);
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
    const { data, statusInfo } = await query("call username_reset_password(?,?,?,?)", [
      // req.userModel.result.id,
      1,
      // req.userModel.result.shop_id,
      "TK001",
      result?.id,
      result?.newpassword,
    ]).catch((error) =>
      res.status(error.status).send(errorResponse({ error }))
    );
    return res.status(statusInfo["status"]).send({ statusInfo });
  },
  UserChangePassword: async (req, res) => {
    const validateKeys = ["!oldPassword", "!newpassword"];
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
    let statusResult;
    await CheckPass(req.userModel.result.id, result.oldPassword).then((data) => {
      console.log("statusResult: ", data);
      statusResult = data;
    });
    if (statusResult.password == true) {
      let salt = genSaltSync(10);
      result.newpassword = hashSync(result.newpassword, salt); // ຮັບຈາກໜ້າບ້ານແລ້ວແປງລະຫັດໃຫ້ເປັນ Bcrypt
      const { data, statusInfo } = await query("call username_change_password(?,?)", [
        req.userModel.result.id,
        result?.newpassword,
      ]).catch((error) =>
        res.status(error.status).send(errorResponse({ error }))
      );
      return res.status(statusInfo["status"]).send({ statusInfo });
    }
    else {
      return res.status(statusResult.status).send({ statusResult });
    }

  },
  UsernameView: async (req, res) => {
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
    const { data, statusInfo } = await query("call username_view(?,?,?,?)",
      [
        req.userModel.result.shop_id,
        "%" + result.search + "%",
        result.start,
        result.limit,
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
