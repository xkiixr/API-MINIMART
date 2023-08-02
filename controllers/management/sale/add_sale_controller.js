const { useValidate } = require("validate-fields-body");
const { query, errorResponse, space } = require("../../../Model/respone_model");
const { log } = require("console");
const json = require("morgan-json");


require("dotenv").config();
module.exports = {
    addSale: async (req, res) => {
        const validateKeys = ["cusID", "payType", "drescript", "Product"];
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
                        message: "ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ",
                    })
                );
            } else {

                result.Product = JSON.stringify(result.Product);
            }
        }
        console.log();


        const { data, statusInfo } = await query("call add_sale(?,?,?,?,?,?)",
            [
                req.userModel.result.id,
                req.userModel.result.shop_id,
                result?.cusID,
                result?.payType,
                result?.drescript,
                result?.Product

            ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
        return res.status(statusInfo["status"]).send({ statusInfo });
    },
    // importUpdate: async (req, res) => {
    //     let importID = req.params.importID
    //     const validateKeys = ["!drescript", "!importStatusID:number", "Product"];
    //     const [isValid, logs, result] = useValidate(validateKeys, req.body);
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
    //     if (importID == ":importID") {
    //         return res.status(301).json(
    //             errorResponse({
    //                 status: 301,
    //                 error: true,
    //                 msg: "require field",
    //                 title: "ຂໍອະໄພ",
    //                 message: "require importID",
    //             })
    //         );
    //     }

    //     if (result.Product) {
    //         result.Product = JSON.stringify(result.Product);
    //         result.Product = JSON.parse(result.Product);
    //         if (typeof result.Product !== "object") {
    //             return res.status(301).send(
    //                 errorResponse({
    //                     status: 301,
    //                     error: true,
    //                     msg: "fail",
    //                     title: "ຂໍອະໄພ",
    //                     message: "ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ: Require parcelID, Require Remark",
    //                 })
    //             );
    //         } else {

    //             result.Product = JSON.stringify(result.Product);

    //         }
    //     }
    //     const { data, statusInfo } = await query("call import_update(?,?,?,?,?,?)",
    //         [
    //             req.userModel.result.id,
    //             req.userModel.result.shop_id,
    //             importID,
    //             result?.drescript,
    //             result?.importStatusID,
    //             result?.Product

    //         ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    //     return res.status(statusInfo["status"]).send({ statusInfo });
    // },

    // // importDelete: async (req, res) => {
    // //     const validateKeys = ["!cateID"];
    // //     const [isValid, logs, result] = useValidate(validateKeys, req.params);
    // //     if (isValid) {
    // //         return res.status(301).json(
    // //             errorResponse({
    // //                 status: 301,
    // //                 error: true,
    // //                 msg: "require field",
    // //                 title: "ຂໍອະໄພ",
    // //                 message: logs[0],
    // //             })
    // //         );

    // //     }
    // //     if (result.cateID == ":cateID") {
    // //         return res.status(301).json(
    // //             errorResponse({
    // //                 status: 301,
    // //                 error: true,
    // //                 msg: "require field",
    // //                 title: "ຂໍອະໄພ",
    // //                 message: "require cateID",
    // //             })
    // //         );
    // //     }

    // //     const { data, statusInfo } = await query("call import_delete(?,?,?)",
    // //         [
    // //             req.userModel.result.id,
    // //             req.userModel.result.shop_id,
    // //             result?.cateID,
    // //         ]).catch((error) => res.status(error.status).send(errorResponse({ error })));


    // //     return res.status(statusInfo["status"]).send({ statusInfo });
    // // },


    // importView: async (req, res) => {
    //     const validateKeys = ["search", "start", "limit"];
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
    //     if (result.search == ":search") {
    //         result.search = "";
    //     }
    //     if (result.start == ":start") {
    //         return res.status(301).json(
    //             errorResponse({
    //                 status: 301,
    //                 error: true,
    //                 msg: "require field",
    //                 title: "ຂໍອະໄພ",
    //                 message: "require start",
    //             })
    //         );
    //     }
    //     if (result.limit == ":limit") {
    //         return res.status(301).json(
    //             errorResponse({
    //                 status: 301,
    //                 error: true,
    //                 msg: "require field",
    //                 title: "ຂໍອະໄພ",
    //                 message: "require limit",
    //             })
    //         );
    //     }

    //     const { data, statusInfo } = await query("call import_view(?,?,?)",
    //         [
    //             "%" + result.search + "%", result?.start, result?.limit
    //         ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    //     console.log(statusInfo.msg);
    //     if (statusInfo.msg !== "success") {
    //         res.status(statusInfo.status).send({ statusInfo });
    //     }
    //     const convert = data[1].map(d => {
    //         return { ...d, product_detail: JSON.parse(d['product_detail']) }
    //     });
    //     return res.status(statusInfo["status"]).json({
    //         statusInfo, data: convert
    //     });
    // },
    // importViewBystatus: async (req, res) => {
    //     const validateKeys = ["statusID", "search", "start", "limit"];
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
    //     if (result.search == ":search") {
    //         result.search = "";
    //     }
    //     if (result.statusID == ":statusID") {
    //         return res.status(301).json(
    //             errorResponse({
    //                 status: 301,
    //                 error: true,
    //                 msg: "require field",
    //                 title: "ຂໍອະໄພ",
    //                 message: "require statusID",
    //             })
    //         );
    //     }
    //     if (result.start == ":start") {
    //         return res.status(301).json(
    //             errorResponse({
    //                 status: 301,
    //                 error: true,
    //                 msg: "require field",
    //                 title: "ຂໍອະໄພ",
    //                 message: "require start",
    //             })
    //         );
    //     }
    //     if (result.limit == ":limit") {
    //         return res.status(301).json(
    //             errorResponse({
    //                 status: 301,
    //                 error: true,
    //                 msg: "require field",
    //                 title: "ຂໍອະໄພ",
    //                 message: "require limit",
    //             })
    //         );
    //     }
    //     const { data, statusInfo } = await query("call import_view_byImportStatus(?,?,?,?)",
    //         [
    //             result?.statusID, "%" + result.search + "%", result?.start, result?.limit
    //         ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    //     console.log(statusInfo.msg);
    //     if (statusInfo.msg !== "success") {
    //         res.status(statusInfo.status).send({ statusInfo });
    //     }
    //     const convert = data[1].map(d => {
    //         return { ...d, product_detail: JSON.parse(d['product_detail']) }
    //     });
    //     return res.status(statusInfo["status"]).json({
    //         statusInfo, data: convert
    //     });
    // },
    // importViewAll: async (req, res) => {
    //     const validateKeys = ["search"];
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
    //     if (result.search == ":search") {
    //         result.search = "";
    //     }
    //     const { data, statusInfo } = await query("call import_view_all(?)",
    //         [
    //             "%" + result.search + "%"
    //         ]).catch((error) => res.status(error.status).send(errorResponse({ error })));
    //     console.log(statusInfo.msg);
    //     if (statusInfo.msg !== "success") {
    //         res.status(statusInfo.status).send({ statusInfo });
    //     }
    //     const convert = data[1].map(d => {
    //         return { ...d, product_detail: JSON.parse(d['product_detail']) }
    //     });
    //     return res.status(statusInfo["status"]).json({
    //         statusInfo, data: convert
    //     });
    // }

};
