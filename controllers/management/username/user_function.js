const pool = require("../../../connectDB");
const { compareSync } = require("bcrypt");
require("dotenv").config();
async function CheckPass(userID, oldPassword) {
    let conn, resp;
    // console.log(req.body);
    try {
        conn = await pool.getConnection();
        resp = await conn.query("call username_checkpass(?)", [userID]);
        if (resp[0][0].msg) {
            resp = {
                status: resp[0][0].status,
                error: resp[0][0].error,
                msg: resp[0][0].msg,
                title: resp[0][0].title,
                message: resp[0][0].message,
            };
        }
        else if (resp[0][0].password) {
            const result = compareSync(oldPassword, resp[0][0].password);
            if (result) {

                resp = {
                    status: 200,
                    error: false,
                    msg: "success",
                    title: "ສຳເລັດ",
                    message: "ລະຫັດຜ່ານຖືກຕ້ອງ",
                    password: true,
                };
                // return res.json(resp);
            } else {
                resp = {
                    status: 409,
                    error: true,
                    msg: "wrong",
                    title: "ຂໍອະໄພ",
                    message: "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ",
                    password: false,
                };
            }
        }
        else {
            resp = {
                status: 400,
                error: true,
                msg: "fail",
                title: "ຂໍອະໄພ",
                message: "ເກີດຂໍ້ຜິດພາດ",
                password: false,
            };
        }
    } catch (error) {
        resp = {
            status: 400,
            error: true,
            msg: "Data Not Found",
            title: "ຂໍອະໄພ",
            message: "ເກີດຂໍ້ຜິດພາດ",
            password: false,
        };
        console.log(error);
        conn.end();
    } finally {
        if (conn) conn.release();
        return resp;
    }
}
module.exports = {
    CheckPass,
};
