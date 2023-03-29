const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");

require("dotenv").config();
module.exports = {
    tableCreate: async (req, res) => {
        const validateKeys = ["!tableNumber", "!tableType", "!tableStatus"];
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

        const { data, statusInfo } = await query("call table_create(?,?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.tableNumber,
                result?.tableType,
                result?.tableStatus

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    tableUpdate: async (req, res) => {
        const tableID = req.params.tableID
        const validateKeys = ["!tableNumber", "!tableType"];
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
        if (tableID == ":tableID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require tableID",
                })
            );
        }

        const { data, statusInfo } = await query("call table_update(?,?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                tableID,
                result?.tableNumber,
                result?.tableType,
                
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    tableDelete: async (req, res) => {
        const validateKeys = ["!tableID"];
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
        if (result.tableID == ":tableID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require tableID",
                })
            );
        }

        const { data, statusInfo } = await query("call table_delete(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.tableID,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));


        return res.status(statusInfo["status"]).send({ statusInfo });
    },


    tableView: async (req, res) => {
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

        const { data, statusInfo } = await query("call table_view(?,?,?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
    tableViewAll: async (req, res) => {
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


        const { data, statusInfo } = await query("call table_view_all(?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },

};
