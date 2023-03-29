const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");

require("dotenv").config();
module.exports = {
    menuCreate: async (req, res) => {
        const validateKeys = ["!foodName", "!foodType", "!menuType"];
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
        const { data, statusInfo } = await query("call menu_create(?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.foodName,
                image,
                result?.foodType,
                result?.menuType,
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
    menuUpdate: async (req, res) => {
        const foodID= req.params.foodID;
        const validateKeys = ["!foodName", "!foodType", "!menuType", "imageUrl"];
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
        if (foodID == ":foodID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require foodID",
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
        const { data, statusInfo } = await query("call menu_update(?,?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                foodID,
                result?.foodName,
                image,
                result?.foodType,
                result?.menuType,
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
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    menuDelete: async (req, res) => {
        const validateKeys = ["foodID"];
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
        if (result.foodID == ":foodID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require foodID",
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
        const { data, statusInfo } = await query("call menu_delete(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.foodID,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
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


    MenuView: async (req, res) => {
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

        const { data, statusInfo } = await query("call menu_view(?,?,?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
    MenuViewAll: async (req, res) => {
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


        const { data, statusInfo } = await query("call menu_view_all(?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },

};
