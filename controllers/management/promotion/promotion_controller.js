const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");

require("dotenv").config();
module.exports = {
    promotionCreate: async (req, res) => {
        const validateKeys = ["!foodID", "qtyBuy", "qtyFree", "timeStart", "timeEnd", "expires"];
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

        const { data, statusInfo } = await query("call promotion_create(?,?,?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.foodID,
                result?.qtyBuy,
                result?.qtyFree,
                result?.timeStart,
                result?.timeStart,
                result?.expires,

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },

    promotionDelete: async (req, res) => {
        const validateKeys = ["!proID"];
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
        if (result.proID == ":proID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require proID",
                })
            );
        }

        const { data, statusInfo } = await query("call promotion_delete(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.proID,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));


        return res.status(statusInfo["status"]).send({ statusInfo });
    },


    promotionView: async (req, res) => {
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

        const { data, statusInfo } = await query("call promotion_view(?,?,?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
    promotionViewAll: async (req, res) => {
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


        const { data, statusInfo } = await query("call promotion_view_all(?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },

};
