const pool = require("../connectDB");
module.exports = {
    GetDropdown: async (req, res) => {
        let conn, resp;
        try {
            conn = await pool.getConnection();
            resp = await conn.query("call dropdown_info()");
            // console.log(resp);
            if (resp[1].length > 0) {
                resp = {
                    status: 200,
                    error: false,
                    supply: resp[0],
                    customer: resp[1],
                    category: resp[2],
                    unit: resp[3],
                    gender: resp[4],
                    import_status_id: resp[5],
                    pay_status: resp[9],
                    pay_type: resp[6],
                    user_status: resp[7],
                    supply_type: resp[8],

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
