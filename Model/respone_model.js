const pool = require("../connectDB");
require("dotenv").config();
const AWS = require("aws-sdk");
const space = new AWS.S3({
  //Get the endpoint from the DO website for your space
  endpoint: process.env.Endpoint,
  useAccelerateEndpoint: false,
  //Create a credential using DO Spaces API key (https://cloud.digitalocean.com/account/api/tokens)
  credentials: new AWS.Credentials(
    process.env.Secret_key_ocean,
    process.env.Secret_id_ocean,
    null
  ), //(secret key , secret id)
});


const errorResponse = ({ title, message, msg, status, error }) => ({
  status: status || error.status || 400,
  error: true,
  msg: msg || "error",
  title: title || "ກະລຸນາກວດສອບຂໍ້ມູນຄືນ",
  message: message || "ເກີດຂໍ້ຜິດພາດ!",
});

const query = async (params, fields) =>
  new Promise(async (res, rej) => {
    const conn = await pool
      .getConnection()
      .catch((err) => rej(errorResponse({ title: "ຜິດພາດ", message: err, msg: "fail", status: 400, error: true })));
    const resp = await conn.query(params, fields).catch((err) => {
      console.log(`\n******** ${err} ********\n`);
      conn.end();
      return rej(errorResponse({ title: "ຜິດພາດ", message: err, msg: "fail", status: 400, error: true }));
    });
    conn.release();
    const info = resp[0][0];
    let container = [];
    if (info["msg"] !== "success") {
      return res({ data: [], statusInfo: resp[0][0] });
    }
    for (let i = 1; i < resp.length - 1; i++) {
      if (Object.keys(resp[i][0])[0].includes("count")) {
        let key = Object.keys(resp[i][0])[0];
        let obj = {};
        obj[key] = Number(resp[i][0][key]);
        container.push(obj);
      } else {
        container.push(resp[i]);
      }
    }
    return res({ data: container, statusInfo: resp[0][0] });
  });

module.exports = { query, errorResponse, space };
