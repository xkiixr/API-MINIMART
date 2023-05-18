var mariadb = require("mariadb");
require("dotenv").config();
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.PORTDB,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connection_limit: 500,
});

module.exports = pool;

