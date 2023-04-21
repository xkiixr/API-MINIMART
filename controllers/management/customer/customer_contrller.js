const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");

require("dotenv").config();
module.exports = {
    customerCreate: async (req, res) => {
        const validateKeys = ["!cusName", "!cusSurname", "!genderID", "!Tel", "!Address", "!Email", "!cusType"];
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
            image = "NO-IMG";
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
        const { data, statusInfo } = await query("call customer_create(?,?,?,?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                result?.cusName,
                result?.cusSurname,
                result?.genderID,
                result?.Tel,
                result?.Address,
                result?.Email,
                result?.cusType,
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

    customerUpdate: async (req, res) => {
        const cusID = req.params.cusID
        const validateKeys = ["!cusName", "!cusSurname", "!genderID", "!Tel", "!Address", "!Email", "!cusType", "imgUrl"];
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
        if (cusID == ":cusID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require cusID",
                })
            );
        }
        if (result.imgUrl) {
            console.log(result.imgUrl);
            console.log(result.imgUrl.split("/"));
            result.imgUrl = result.imgUrl.split("/");
            result.imgUrl = result.imgUrl[result.imgUrl.length - 1];
            console.log("result.imgUrl: ", result.imgUrl);
        }
        if (!req.file) {
            //ກວດສອບຟາຍທີ່ສົ່ງມາວ່າເປັນຄ່າວ່າງ ຫຼື ບໍ່
            image = result.imgUrl;
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
        const { data, statusInfo } = await query("call customer_update(?,?,?,?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                cusID,
                result?.cusName,
                result?.cusSurname,
                result?.genderID,
                result?.Tel,
                result?.Address,
                result?.Email,
                result?.cusType,
                image
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        if (statusInfo["msg"] == "success") {
            if (req.file) {
                let params = {
                    Bucket: process.env.BucketName,
                    Key: result?.img,
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
    customerDelete: async (req, res) => {
        const cusID = req.params.cusID
        const validateKeys = ["imgUrl"];
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
        if (!result.imgUrl) {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require body value imgUrl",
                })
            );
        }
        if (cusID == ":cusID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require cusID",
                })
            );
        }
        if (result.imgUrl) {
            console.log(result.imgUrl);
            console.log(result.imgUrl.split("/"));
            result.imgUrl = result.imgUrl.split("/");
            result.imgUrl = result.imgUrl[result.imgUrl.length - 1];
            console.log("result.imgUrl: ", result.imgUrl);
        }
        const { data, statusInfo } = await query("call customer_delete(?,?)",
            [
                req.userModel.result.id,
                cusID

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        if (statusInfo["msg"] == "success") {
            if (req.file) {
                let params = {
                    Bucket: process.env.BucketName,
                    Key: result?.imgUrl,
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


    customerView: async (req, res) => {
        const validateKeys = ["search", "start", "limit"];
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

        const { data, statusInfo } = await query("call customer_view(?,?,?)",
            [
                "%" + result.search + "%",
                result?.start,
                result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
    customerViewAll: async (req, res) => {
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
        const { data, statusInfo } = await query("call customer_view_all(?)",
            [
                "%" + result.search + "%",
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
};
