const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");
const json = require("morgan-json");


require("dotenv").config();
module.exports = {
    productCreate: async (req, res) => {
        const validateKeys = ["!productID:number", "!productName", "!costPrice:number", "Expire", "Detail"];
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

        if (result.Detail) {
            result.Detail = JSON.stringify(result.Detail);
            result.Detail = JSON.parse(result.Detail);
            console.log(result.Detail);
            if (typeof result.Detail !== "object") {
                return res.status(301).send(
                    errorResponse({
                        status: 301,
                        error: true,
                        msg: "fail",
                        title: "ຂໍອະໄພ",
                        message: "ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ"
                    })
                );
            } else {
                result.Detail = JSON.stringify(result.Detail);
                console.log(result.Detail);

            }
        }

        const { data, statusInfo } = await query("call product_create(?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                result?.productID,
                result?.productName,
                result?.costPrice,
                result?.Expire,
                result?.Detail

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        console.log(statusInfo);

        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    productUpdate: async (req, res) => {
        const productID = req.params.productID
        const validateKeys = ["!cateID:number", "!productName", "!costPrice:number", "Expire"];
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
        if (productID == ":productID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require productID",
                })
            );
        }


        const { data, statusInfo } = await query("call product_update(?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                result?.cateID,
                productID,
                result?.productName,
                result?.costPrice,
                result?.Expire,

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        console.log(statusInfo);

        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    productUpdateDetail: async (req, res) => {
        const productID = req.params.productID
        const validateKeys = ["Detail"];
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
        if (productID == ":productID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require productID",
                })
            );
        }
        if (result.Detail) {
            result.Detail = JSON.stringify(result.Detail);
            result.Detail = JSON.parse(result.Detail);
            console.log(result.Detail);
            if (typeof result.Detail !== "object") {
                return res.status(301).send(
                    errorResponse({
                        status: 301,
                        error: true,
                        msg: "fail",
                        title: "ຂໍອະໄພ",
                        message: "ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ"
                    })
                );
            } else {
                result.Detail = JSON.stringify(result.Detail);
            }
        }


        const { data, statusInfo } = await query("call product_detail_update(?,?,?)",
            [
                req.userModel.result.id,
                productID,
                result?.Detail,

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        console.log(statusInfo);

        return res.status(statusInfo["status"]).send({ statusInfo });
    },

    productDelete: async (req, res) => {
        const validateKeys = ["!productID"];
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
        if (result.productID == ":productID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require productID",
                })
            );
        }

        const { data, statusInfo } = await query("call product_delete(?,?)",
            [
                req.userModel.result.id,
                result?.productID,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));


        return res.status(statusInfo["status"]).send({ statusInfo });
    },


    productView: async (req, res) => {
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
        const { data, statusInfo } = await query("call product_view(?,?,?)",
            [
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        console.log(statusInfo.msg);
        if (statusInfo.msg !== "success") {
            res.status(statusInfo.status).send({ statusInfo });
        }
        const convert = data[1].map(d => {
            return { ...d, product_unit: JSON.parse(d['product_unit']) }
        });
        return res.status(statusInfo["status"]).json({
            statusInfo, count_product: data[0].count_product, data: convert
        });
    },

    productViewAll: async (req, res) => {
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


        const { data, statusInfo } = await query("call product_view_all(?)",
            [
                "%" + result.search + "%"
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        console.log(statusInfo.msg);
        if (statusInfo.msg !== "success") {
            res.status(statusInfo.status).send({ statusInfo });
        }
        const convert = data[1].map(d => {
            return { ...d, product_unit: JSON.parse(d['product_unit']) }
        });
        return res.status(statusInfo["status"]).json({
            statusInfo, count_product: data[0].count_product, data: convert
        });
    },
    productViewcateID: async (req, res) => {

        const validateKeys = ["search", "cateID"];
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
        if (result.cateID == ":cateID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require cateID",
                })
            );
        }


        const { data, statusInfo } = await query("call product_view_bycateID(?,?)",
            [
                "%" + result.search + "%", result?.cateID
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        console.log(statusInfo.msg);
        if (statusInfo.msg !== "success") {
            res.status(statusInfo.status).send({ statusInfo });
        }
        const convert = data[1].map(d => {
            return { ...d, product_unit: JSON.parse(d['product_unit']) }
        });
        return res.status(statusInfo["status"]).json({
            statusInfo, count_product: data[0].count_product, data: convert
        });
    },
    productViewBarcode: async (req, res) => {
        const validateKeys = ["Barcode"];
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
        if (result.Barcode == ":Barcode") {
            result.Barcode = "";
        }


        const { data, statusInfo } = await query("call product_view_byBarcode(?)",
            [
                result.Barcode
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },


};
