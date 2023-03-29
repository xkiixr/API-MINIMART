const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");

require("dotenv").config();
module.exports = {
    foodtypeCreate: async (req, res) => {
        const validateKeys = ["!foodTypeName"];
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

        const { data, statusInfo } = await query("call food_type_create(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.foodTypeName,

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    foodtypeUpdate: async (req, res) => {
        const foodTypeID = req.params.foodTypeID
        const validateKeys = ["!foodtypeName"];
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
        if (foodTypeID == ":foodTypeID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require foodTypeID",
                })
            );
        }

        const { data, statusInfo } = await query("call food_type_update(?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                foodTypeID,
                result?.foodtypeName,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    foodtypeDelete: async (req, res) => {
        const validateKeys = ["!foodTypeID"];
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
        if (result.foodTypeID == ":foodTypeID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require foodTypeID",
                })
            );
        }

        const { data, statusInfo } = await query("call food_type_delete(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.foodTypeID,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));


        return res.status(statusInfo["status"]).send({ statusInfo });
    },


    foodtypeView: async (req, res) => {
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

        const { data, statusInfo } = await query("call food_type_view(?,?,?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },
    foodtypeViewAll: async (req, res) => {
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


        const { data, statusInfo } = await query("call food_type_view_all(?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },

};
