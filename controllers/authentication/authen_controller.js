const pool = require("../../connectDB");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();
async function CheckToken(token) {
  let resp;
  try {
    if (token) {
      token = token.slice(7);
      verify(token, process.env.SECRET_KEY_BYCRYPT, (err, decoded) => {
        if (err) {
          resp = {
            status: 201,
            error: false,
            msg: "expire",
            title: "ຂໍອະໄພ",
            message: "Token ຂອງທ່ານໝົດອາຍຸ",
          };
        } else {
          resp = {
            status: 200,
            error: false,
            msg: "success",
            title: "ສຳເລັດ",
            message: "Token ຍັງບໍ່ທັນໝົດອາຍຸ",
          };
        }
      });
    } else {
      resp = {
        status: 200,
        error: false,
        msg: "Invalid Token",
        title: "ຂໍອະໄພ",
        message: "ບໍ່ພົບ Token ທີ່ສົ່ງມາ",
      };
    }
  } catch (error) {
    resp = {
      status: 201,
      error: true,
      msg: "Data Not Found",
      title: "ຂໍອະໄພ",
      message: "ເກີດຂໍ້ຜິດພາດ",
    };
    console.log(error);
  } finally {
    return resp;
  }
}
module.exports = {
  Signin: async (req, res) => {
    let { email, password } = req.body;
    let conn, resp;
    // console.log(req.body);
    try {
      conn = await pool.getConnection();
      resp = await conn.query("call login(?)", [email]);
      // console.log(resp[2][0].password);
      if (resp[0][0].msg) {
        resp = {
          status: resp[0][0].status,
          error: resp[0][0].error,
          msg: resp[0][0].msg,
          title: resp[0][0].title,
          message: resp[0][0].message,
        };
      } else {
        const result = compareSync(password, resp[2][0].password);
        if (result) {
          resp[0][0].password = undefined;
          const jsontoken = sign(
            {
              result: {
                id: resp[0][0].user_id,
                name: resp[0][0].name,
                shop_id: resp[0][0].shop_id,
                stt_id: resp[0][0].stt_id,
                password: resp[2][0].password,
                shop_id: resp[0][0].shop_id
              },

            },
            process.env.SECRET_KEY_BYCRYPT,
            {
              // expiresIn: "3h",
              expiresIn: "1d",
            }
          );
          const refreshToken = sign(
            {
              result: {
                password: resp[2][0].password,
                id: resp[0][0].user_id,
                shop_id: resp[0][0].shop_id
              },

            },
            process.env.SECRET_KEY_BYCRYPT_REFRESH,
            {
              // expiresIn: "30d",
              expiresIn: "1d",
            }
          );
          resp = {
            status: 200,
            error: false,
            login: "success",
            access_token: jsontoken,
            Refresh_Token: refreshToken,
            userInfo: resp[0][0],
            userPermission: resp[1][0],
          };
          // return res.json(resp);
        } else {
          resp = {
            status: 201,
            error: true,
            msg: "Invalid email or password compare false",
            title: "ຂໍອະໄພ",
            message: "ລະຫັດຜ່ານ ຫຼື ອີເມວບໍ່ຖືກຕ້ອງ",
          };
        }
      }
    } catch (error) {
      resp = {
        status: 201,
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
  RefreshToken: async (req, res) => {
    let token = req.get("authorization");
    let { refreshToken } = req.body;
    let resp, conn;
    let jsontoken;
    let CheckTokenData;
    if (refreshToken || !token) {
      //   refreshToken = refreshToken.slice(7);
      await CheckToken(token).then((data) => {
        // console.log("check Token: ", data);
        CheckTokenData = data;
      });
      if (CheckTokenData.msg != "expire") {
        resp = {
          status: CheckTokenData.status,
          error: CheckTokenData.error,
          msg: CheckTokenData.msg,
          title: CheckTokenData.title,
          message: CheckTokenData.message,
        };
        return res.status(resp.status).json(resp);
      } else {
        verify(
          refreshToken,
          process.env.SECRET_KEY_BYCRYPT_REFRESH,
          (err, decoded) => {
            if (err) {
              resp = {
                status: 200,
                error: false,
                msg: "Refresh Token Expired",
                title: "ຂໍອະໄພ",
                message: "Token Refresh ໝົດອາຍຸກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່ອີກຄັ້ງ",
              };
              return res.status(resp.status).json(resp);
            } else {
              try {
                jsontoken = sign(
                  {
                    result: {
                      _id: token,
                      roles: refreshToken,
                      id: decoded?.result?.id,
                      shop_id: decoded?.result?.shop_id
                    },

                  },
                  process.env.SECRET_KEY_BYCRYPT,
                  {
                    expiresIn: "5h",
                  }
                );

                resp = {
                  status: 201,
                  error: false,
                  msg: "Renew Token",
                  access_token: jsontoken,
                };
              } catch (error) {
                resp = {
                  status: 201,
                  error: true,
                  // error: error,
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
            }
          }
        );
      }
    } else {
      resp = {
        status: 200,
        error: false,
        msg: "Invalid Token Refresh",
        title: "ຂໍອະໄພ",
        message: "ບໍ່ພົບ Token Refresh ທີ່ສົ່ງມາ",
      };
      return res.status(resp.status).json(resp);
    }
  },
};
