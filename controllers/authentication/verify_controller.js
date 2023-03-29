const { verify } = require("jsonwebtoken");
const pool = require("../../connectDB");
require("dotenv").config();
module.exports = {
  CheckPassKey: (req, res, next) => {
    let { secretid, secretsingnature } = req.headers;
    let resp;
    try {
      var getBody = req.body;
      getBody = JSON.stringify(getBody);
      console.log(getBody);

      if (
        !secretid ||
        secretid !== process.env.SECRET_ID ||
        !secretsingnature
      ) {
        resp = {
          status: 200,
          error: false,
          msg: "fail",
          title: "ຂໍອະໄພ",
          message: "ທ່ານບໍ່ມີຄີໃນການເຂົ້າລະຫັດ",
        };
        return res.status(resp.status).json(resp);
      } else {
        var CryptoJS = require("crypto-js");
        // Encrypt
        // var ciphertext = CryptoJS.AES.encrypt(getBody, process.env.SECRET_SINGNATURE).toString();
        // console.log("ciphertext: " + ciphertext);
        // // // Decrypt
        // var bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_SINGNATURE);
        // // console.log("bytes: " + bytes);
        // var originalText = bytes.toString(CryptoJS.enc.Utf8);
        // console.log("decrypt: " + originalText);

        // Decrypt
        console.log('This is -------KEY:   ',secretsingnature);
        var bytes = CryptoJS.AES.decrypt(
          secretsingnature,
          process.env.SECRET_SINGNATURE
        );
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        console.log("SIGNATURE: " + originalText);
        if (getBody == originalText) {
          next();
        } else {
          resp = {
            status: 400,
            error: false,
            msg: "singnature fail",
            title: "ຂໍອະໄພ",
            message: "ລາຍເຊັນຂອງທ່ານຜິດພາດ",
          };
          return res.status(resp.status).json(resp);
        }
      }
    } catch (error) {
      console.log(error);
      resp = {
        status: 400,
        error: false,
        msg: "Data Not Found",
        title: "ຂໍອະໄພ",
        message: "ລາຍເຊັນຂອງທ່ານຜິດພາດ",
      };
      return res.status(resp.status).json(resp);
    }
  },
  CheckPassKeyID: (req, res, next) => {
    let { secretid } = req.headers;
    let resp;
    try {
      if (!secretid || secretid !== process.env.SECRET_ID) {
        resp = {
          status: 301,
          error: false,
          msg: "fail",
          title: "ຂໍອະໄພ",
          message: "ທ່ານບໍ່ມີຄີໃນການເຂົ້າລະຫັດ",
        };
        return res.status(resp.status).json(resp);
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      resp = {
        status: 400,
        error: false,
        msg: "Data Not Found",
        title: "ຂໍອະໄພ",
        message: "ທ່ານບໍ່ມີຄີໃນການເຂົ້າລະຫັດ",
      };
      return res.status(resp.status).json(resp);
    }
  },
  verifyToken: (req, res, next) => {
    let token = req.get("authorization");
    let resp;
    if (token) {
      token = token.slice(7);
      verify(token, process.env.SECRET_KEY_BYCRYPT, (err, decoded) => {
        if (err) {
          resp = {
            status: 401,
            error: false,
            msg: "Token Expired",
            title: "ຂໍອະໄພ",
            message: "Token ຂອງທ່ານໝົດອາຍຸ",
          };
          return res.status(resp.status).json(resp);
        }
        else if (!decoded?.result?.id) {
          resp = {
            status: 401,
            error: true,
            msg: "field",
            title: "ຂໍອະໄພ",
            message: "Token ຂອງທ່ານຜິດພາດ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່",
          };
          return res.status(resp.status).json(resp);
        }
        else {
          req.userModel = decoded;
          next();
        }
      });
    } else {
      resp = {
        status: 301,
        error: false,
        msg: "Invalid Token",
        title: "ຂໍອະໄພ",
        message: "ບໍ່ພົບ Token ທີ່ສົ່ງມາ",
      };
      return res.status(resp.status).json(resp);
    }
  },
  CheckValidateToken: async (req, res) => {
    let token = req.get("authorization");
    let resp;

    try {
      if (token) {
        token = token.slice(7);
        verify(token, process.env.SECRET_KEY_BYCRYPT, (err, decoded) => {
          if (err) {
            resp = {
              status: 401,
              error: false,
              msg: "Token Expired",
              title: "ຂໍອະໄພ",
              message: "Token ຂອງທ່ານໝົດອາຍຸ",
            };
            return res.status(resp.status).json(resp);
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
          status: 301,
          error: false,
          msg: "Invalid Token",
          title: "ຂໍອະໄພ",
          message: "ບໍ່ພົບ Token ທີ່ສົ່ງມາ",
        };
      }
    } catch (error) {
      resp = {
        status: 400,
        error: true,
        msg: "Data Not Found",
        title: "ຂໍອະໄພ",
        message: "ເກີດຂໍ້ຜິດພາດ",
      };
      console.log(error);
      // conn.end();
    } finally {
      // if (conn) conn.release();
      return res.status(resp.status).json(resp);
    }
  },
};
