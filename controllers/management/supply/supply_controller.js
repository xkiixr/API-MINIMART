const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");

require("dotenv").config();
module.exports = {
    supplyCreate: async (req, res) => {
        const validateKeys = ["!supplyCode", "!supplyName", "genderID", "!Tel", "Address", "Email", "!supplyType"];
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

        const { data, statusInfo } = await query("call supply_create(?,?,?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                result?.supplyCode,
                result?.supplyName,
                result?.genderID,
                result?.Tel,
                result?.Address,
                result?.Email,
                result?.supplyType,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },

    supplyUpdate: async (req, res) => {
        const supplyID = req.params.supplyID
        const validateKeys = ["!supplyCode", "!supplyName", "genderID", "!Tel", "Address", "Email", "!supplyType"];
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
        if (supplyID == ":supplyID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require supplyID",
                })
            );
        }

        const { data, statusInfo } = await query("call supply_update(?,?,?,?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                supplyID,
                result?.supplyCode,
                result?.supplyName,
                result?.genderID,
                result?.Tel,
                result?.Address,
                result?.Email,
                result?.supplyType,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    supplyDelete: async (req, res) => {
        const supplyID = req.params.supplyID
        if (supplyID == ":supplyID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require supplyID",
                })
            );
        }
        const { data, statusInfo } = await query("call supply_delete(?,?)",
            [
                req.userModel.result.id,
                supplyID
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },


    supplyView: async (req, res) => {
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

        const { data, statusInfo } = await query("call supply_view(?,?,?)",
            [
                "%" + result.search + "%",
                result?.start,
                result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
    supplyViewAll: async (req, res) => {
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
        const { data, statusInfo } = await query("call supply_view_all(?)",
            [
                "%" + result.search + "%",
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
};
