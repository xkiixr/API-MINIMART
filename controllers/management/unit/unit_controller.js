const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");

require("dotenv").config();
module.exports = {
    unitCreate: async (req, res) => {
        const validateKeys = ["!unitName"];
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

        const { data, statusInfo } = await query("call unit_create(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.unitName,

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    unitUpdate: async (req, res) => {
        const unitID = req.params.unitID
        const validateKeys = ["!unitName"];
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
        if (unitID == ":unitID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require unitID",
                })
            );
        }

        const { data, statusInfo } = await query("call unit_update(?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                unitID,
                result?.unitName,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    unitDelete: async (req, res) => {
        const validateKeys = ["!unitID"];
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
        if (result.unitID == ":unitID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require unitID",
                })
            );
        }

        const { data, statusInfo } = await query("call unit_delete(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.unitID,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));


        return res.status(statusInfo["status"]).send({ statusInfo });
    },


    unitView: async (req, res) => {
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

        const { data, statusInfo } = await query("call unit_view(?,?,?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
    unitViewAll: async (req, res) => {
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


        const { data, statusInfo } = await query("call unit_view_all(?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },

};
