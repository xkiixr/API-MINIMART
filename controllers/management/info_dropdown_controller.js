const pool = require("../../connectDB");
module.exports = {
    GetDropdown: async (req, res) => {
        let conn, resp;
        try {
            conn = await pool.getConnection();
            resp = await conn.query("call dropdown_info(?)", req.userModel.result.shop_id,);
            // console.log(resp);
            if (resp[1].length > 0) {
                resp = {
                    status: 200,
                    error: false,
                    shopAccount: resp[0],
                    category: resp[1],
                    customer: resp[2],
                    exchange: resp[3],
                    foodType: resp[4],
                    foodMenu: resp[5],
                    tables: resp[6],
                    unit: resp[7],
                    username: resp[8],
                };
            } else {
                resp = {
                    status: 500,
                    error: "true",
                    msg: "fail",
                    title: "ຂໍອະໄພ",
                    message: "ເກີດຂໍ້ຜິດພາດ",
                };
            }
            // End
        } catch (error) {
            resp = {
                status: 500,
                error: true,
                msg: "Data Not Found",
                title: "ຂໍອະໄພ",
                message: "ເກີດຂໍ້ຜິດພາດ",
            };
            console.log(error);
            conn.end();
        } finally {
            if (conn) conn.release();
            return res.status(resp.status).json(resp);
        }
    },

};
