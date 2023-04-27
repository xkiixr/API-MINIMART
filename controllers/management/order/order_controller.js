const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");
const { log } = require("console");
const json = require("morgan-json");
const pool = require("../../../connectDB");

require("dotenv").config();
module.exports = {
    orderCreate: async (req, res) => {
        const validateKeys = ["!drescript", "!supplyID:number", "!payID:number", "!payStatusID:number", "Product"];
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

        if (result.Product) {
            result.Product = JSON.stringify(result.Product);
            result.Product = JSON.parse(result.Product);
            if (typeof result.Product !== "object") {
                return res.status(301).send(
                    errorResponse({
                        status: 301,
                        error: true,
                        msg: "fail",
                        title: "ຂໍອະໄພ",
                        message: "ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ: Require parcelID, Require Remark",
                    })
                );
            } else {

                result.Product = JSON.stringify(result.Product);

            }
        }
        console.log();

        const { data, statusInfo } = await query("call order_create(?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                result?.drescript,
                result?.supplyID,
                result?.payID,
                result?.payStatusID,
                result?.Product

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    orderUpdate: async (req, res) => {
        let orderID = req.params.orderID
        const validateKeys = ["!drescript", "!supplyID:number", "!payID:number", "!payStatusID:number", "Product"];
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
        if (orderID == ":orderID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require orderID",
                })
            );
        }
        if (result.Product) {
            result.Product = JSON.stringify(result.Product);
            result.Product = JSON.parse(result.Product);
            if (typeof result.Product !== "object") {
                return res.status(301).send(
                    errorResponse({
                        status: 301,
                        error: true,
                        msg: "fail",
                        title: "ຂໍອະໄພ",
                        message: "ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ: Require parcelID, Require Remark",
                    })
                );
            } else {

                result.Product = JSON.stringify(result.Product);

            }
        }

        const { data, statusInfo } = await query("call order_update(?,?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                orderID,
                result?.drescript,
                result?.supplyID,
                result?.payID,
                result?.payStatusID,
                result?.Product
            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    // orderDelete: async (req, res) => {
    //     const validateKeys = ["!cateID"];
    //     const [isValid, logs, result] = useValidate(validateKeys, req.params);
    //     if (isValid) {
    //         return res.status(301).json(
    //             errorResponse({
    //                 status: 301,
    //                 error: true,
    //                 msg: "require field",
    //                 title: "ຂໍອະໄພ",
    //                 message: logs[0],
    //             })
    //         );

    //     }
    //     if (result.cateID == ":cateID") {
    //         return res.status(301).json(
    //             errorResponse({
    //                 status: 301,
    //                 error: true,
    //                 msg: "require field",
    //                 title: "ຂໍອະໄພ",
    //                 message: "require cateID",
    //             })
    //         );
    //     }

    //     const { data, statusInfo } = await query("call order_delete(?,?,?)",
    //         [
    //             req.userModel.result.id,
    //             req.userModel.result.shop_id,
    //             result?.cateID,
    //         ]).catch((error) => res.status(error.status).send(errorResponse({ error })));


    //     return res.status(statusInfo["status"]).send({ statusInfo });
    // },


    orderView: async (req, res) => {
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

        const resp = await conn.query("call order_view(?,?,?)",
            [
                "%" + result.search + "%", result?.start, result?.limit
            ])

        if (resp[0][0].msg !== "success") {
            error = { statusInfo: resp[0][0] }

            res.status(resp[0][0].status).send(error);
        }

        statusInfo = resp[0][0]
        // for (let i = 0; i < resp[2].length; i++) {
        //     console.log(i);
        //     data = {
        //         order_id: resp[2][i].order_id,
        //         order_code: resp[2][i].order_code,
        //         order_barcode: resp[2][i].order_barcode,
        //         order_name: resp[2][i].order_name,
        //         cost_price: resp[2][i].cost_price,
        //         category_name: resp[2][i].category_name,
        //         order_unit: JSON.parse(resp[2][i].order_unit),
        //         expire_date: resp[2][i].expire_date,
        //     }
        // }
        data = resp[2]

        const convert = data.map(d => {
            return { ...d, product_detail: JSON.parse(d['product_detail']) }
        });



        return res.status(statusInfo["status"]).json({
            statusInfo, data: convert,

        });
    },
    orderViewAll: async (req, res) => {
        let conn = await pool.getConnection();
        let statusInfo
        let data
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


        const resp = await conn.query("call order_view_all(?)",
            [
                "%" + result.search + "%"
            ]);
        if (resp[0][0].msg !== "success") {
            error = { statusInfo: resp[0][0] }

            res.status(resp[0][0].status).send(error);
        }
        else {





            statusInfo = resp[0][0]
            // for (let i = 0; i < resp[2].length; i++) {
            //     console.log(i);
            //     data = {
            //         order_id: resp[2][i].order_id,
            //         order_code: resp[2][i].order_code,
            //         order_barcode: resp[2][i].order_barcode,
            //         order_name: resp[2][i].order_name,
            //         cost_price: resp[2][i].cost_price,
            //         category_name: resp[2][i].category_name,
            //         order_unit: JSON.parse(resp[2][i].order_unit),
            //         expire_date: resp[2][i].expire_date,
            //     }
            // }
            data = resp[2]

            const convert = data.map(d => {
                return { ...d, product_detail: JSON.parse(d['product_detail']) }
            });



            return res.status(statusInfo["status"]).json({
                statusInfo, data: convert,

            });
        }
    }
    ,
    orderViewBypayId: async (req, res) => {
        let conn = await pool.getConnection();
        let statusInfo
        let data
        const validateKeys = ["payID", "search", "start", "limit"];
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
        if (result.payID == ":payID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require payID",
                })
            );
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

        const resp = await conn.query("call order_view_by_payID(?,?,?,?)",
            [
                result?.payID, "%" + result.search + "%", result?.start, result?.limit
            ])

        if (resp[0][0].msg !== "success") {
            error = { statusInfo: resp[0][0] }

            res.status(resp[0][0].status).send(error);
        }

        statusInfo = resp[0][0]
        // for (let i = 0; i < resp[2].length; i++) {
        //     console.log(i);
        //     data = {
        //         order_id: resp[2][i].order_id,
        //         order_code: resp[2][i].order_code,
        //         order_barcode: resp[2][i].order_barcode,
        //         order_name: resp[2][i].order_name,
        //         cost_price: resp[2][i].cost_price,
        //         category_name: resp[2][i].category_name,
        //         order_unit: JSON.parse(resp[2][i].order_unit),
        //         expire_date: resp[2][i].expire_date,
        //     }
        // }
        data = resp[2]

        const convert = data.map(d => {
            return { ...d, product_detail: JSON.parse(d['product_detail']) }
        });



        return res.status(statusInfo["status"]).json({
            statusInfo, data: convert,

        });
    },
    orderViewBypaystatusId: async (req, res) => {
        let conn = await pool.getConnection();
        let statusInfo
        let data
        const validateKeys = ["paystatusID", "search", "start", "limit"];
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
        if (result.paystatusID == ":paystatusID") {
            return res.status(301).json(
                errorResponse({
                    status: 301,
                    error: true,
                    msg: "require field",
                    title: "ຂໍອະໄພ",
                    message: "require payStatusID",
                })
            );
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

        const resp = await conn.query("call order_view_by_payStatusID(?,?,?,?)",
            [
                result?.paystatusID, "%" + result.search + "%", result?.start, result?.limit
            ])

        if (resp[0][0].msg !== "success") {
            error = { statusInfo: resp[0][0] }

            res.status(resp[0][0].status).send(error);
        }

        statusInfo = resp[0][0]
        // for (let i = 0; i < resp[2].length; i++) {
        //     console.log(i);
        //     data = {
        //         order_id: resp[2][i].order_id,
        //         order_code: resp[2][i].order_code,
        //         order_barcode: resp[2][i].order_barcode,
        //         order_name: resp[2][i].order_name,
        //         cost_price: resp[2][i].cost_price,
        //         category_name: resp[2][i].category_name,
        //         order_unit: JSON.parse(resp[2][i].order_unit),
        //         expire_date: resp[2][i].expire_date,
        //     }
        // }
        data = resp[2]

        const convert = data.map(d => {
            return { ...d, product_detail: JSON.parse(d['product_detail']) }
        });



        return res.status(statusInfo["status"]).json({
            statusInfo, data: convert,

        });
    },

};
