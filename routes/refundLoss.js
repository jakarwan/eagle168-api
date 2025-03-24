const express = require("express");
const app = express();
const router = express.Router();
const connection = require("../config/connection");
const jwt = require("jsonwebtoken");
const verifyToken = require("../routes/verifyToken");
const paginatedResults = require("../routes/pagination");
const moment = require("moment");

router.get("/", (req, res) => {
  // jwt.verify(req.token, "secretkey", (err, data) => {
  var sql =
    "SELECT SUM(p.total) as pay_total, SUM(pl.total) as prize_total, SUM(p.total - pl.total) as total FROM poy as p LEFT JOIN prize_log as pl ON p.created_by = pl.created_by WHERE p.date_lotto = curdate() AND pl.lotto_date = curdate();";
  connection.query(sql, [], (error, result, fields) => {
    if (error) return console.log(error);
    return res.status(200).send({ status: true, data: result });
  });
});

module.exports = router;
