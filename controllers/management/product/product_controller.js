const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");
const { log } = require("console");
const json = require("morgan-json");
const pool = require("../../../connectDB");

require("dotenv").config();
module.exports = {
    productCreate: async (req, res) => {
        const validateKeys = ["!cateName"];
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

        const { data, statusInfo } = await query("call product_create(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.cateName,

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    productUpdate: async (req, res) => {
        const cateID = req.params.cateID
        const validateKeys = ["!cateName"];
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
        if (cateID == ":cateID") {
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

        const { data, statusInfo } = await query("call product_update(?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                cateID,
                result?.cateName,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    productDelete: async (req, res) => {
        const validateKeys = ["!cateID"];
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

        const { data, statusInfo } = await query("call product_delete(?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.cateID,
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));


        return res.status(statusInfo["status"]).send({ statusInfo });
    },


    productView: async (req, res) => {
        let conn = await pool.getConnection();
        let statusInfo
        let data
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

        const resp = await conn.query("call product_view(?,?,?)",
            [
                "%" + result.search + "%", result?.start, result?.limit
            ])
        console.log();

        if (resp[0][0].msg !== "success") {
            error = { statusInfo: resp[0][0] }

            res.status(resp[0][0].status).send(error);
        }



        statusInfo = resp[0][0]
        // for (let i = 0; i < resp[2].length; i++) {
        //     console.log(i);
        //     data = {
        //         product_id: resp[2][i].product_id,
        //         product_code: resp[2][i].product_code,
        //         product_barcode: resp[2][i].product_barcode,
        //         product_name: resp[2][i].product_name,
        //         cost_price: resp[2][i].cost_price,
        //         category_name: resp[2][i].category_name,
        //         product_unit: JSON.parse(resp[2][i].product_unit),
        //         expire_date: resp[2][i].expire_date,
        //     }
        // }
        data = resp[2]

        const convert = data.map(d => {
            return { ...d, product_unit: JSON.parse(d['product_unit']) }
        });



        return res.status(statusInfo["status"]).json({
            statusInfo, data: convert,

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


        const { data, statusInfo } = await query("call product_view_all(?,?)",
            [
                req.userModel.result.shop_id,
                "%" + result.search + "%", result?.start, result?.limit
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo, data });
    },

};
