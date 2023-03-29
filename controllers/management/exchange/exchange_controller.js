const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");
require("dotenv").config();
module.exports = {
    ExchangeCreate: async (req, res) => {
        const validateKeys = ["!currency:number", "!buy:number", "!sell:number"];
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

        const { data, statusInfo } = await query("call exchange_create(?,?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.currency,
                result?.buy,
                result?.sell
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    ExchangeUpdate: async (req, res) => {
        const validateKeys = ["!rate:number", "!buy:number", "!sell:number"];
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

        const { data, statusInfo } = await query("call exchange_update(?,?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.rate,
                result?.buy,
                result?.sell
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    ExchangeDelete: async (req, res) => {
        const validateKeys = ["!rate:number", "!buy:number", "!sell:number"];
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
        const { data, statusInfo } = await query("call exchange_delete(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.rate
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    ExchangeView: async (req, res) => {
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
        const { data, statusInfo } = await query("call exchange_view(?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result?.search + "%"
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
};
