const express = require("express");
const app = express();
const router = express.Router();
const connection = require("../config/connection");
const jwt = require("jsonwebtoken");
const verifyToken = require("../routes/verifyToken");
const paginatedResults = require("../routes/pagination");
const moment = require("moment");

function func3back(number) {
  var num = number; //ตัวเลขที่ต้องการหาโต๊ด
  var textnum = num.toString(); //แปลงตัวเลขเป็นตัวอักษร
  var numlv1 = []; //ประกาศตัวแปลให้เป็น Array
  var numlv2 = [];
  var result = [];
  //จัดการ level 1 โดยการสลับตัวเลข 2 หลักซ้ายสุด
  numlv1[0] = textnum.substr(0, 1) + textnum.substr(1, 1);
  numlv1[1] = textnum.substr(1, 1) + textnum.substr(0, 1);
  //จัดการ level 2
  var endnum = textnum.substr(2, 1); //จำเลขตัวสุดท้าย
  for (var i = 0; i <= 2 - 1; i++) {
    //วนลูปการแทรกตัวเลข ทั้ง 2 ตัวเลขจาก level 1
    numlv2[0] = numlv1[i].substr(0, 1); //แยกตัวเลข หลักแรกออกมา จากตัวเลข level 1
    numlv2[1] = numlv1[i].substr(1, 1); //แยกตัวเลข หลักที่ 2 ออกมา จากตัวเลข level 1
    result.push(
      endnum + numlv2[0] + numlv2[1],
      numlv2[0] + endnum + numlv2[1],
      numlv2[0] + numlv2[1] + endnum
    );
  }
  let dup = [...new Set(result)];
  return dup;
}

function func4back(number) {
  var textnum = number.toString(); // แปลงตัวเลขเป็น string
  var result = new Set();

  // ฟังก์ชันหาค่าจัดเรียง (Permutation)
  function permute(arr, temp = "") {
    if (arr.length === 0) {
      result.add(temp); // เพิ่มค่าเข้า Set เพื่อป้องกันค่าซ้ำ
    } else {
      for (let i = 0; i < arr.length; i++) {
        let newArr = arr.slice(0, i).concat(arr.slice(i + 1));
        permute(newArr, temp + arr[i]);
      }
    }
  }

  // เรียกใช้ฟังก์ชันเพื่อหาค่าจัดเรียงทั้งหมด
  permute(textnum.split(""));

  return [...result]; // แปลง Set กลับเป็น Array
}

function dateChange(d) {
  return moment(d).format("YYYY-MM-DD");
}

// router.get("/", (req, res) => {
//   // jwt.verify(req.token, "secretkey", (err, data) => {
//   // if (!err) {
//   try {
//     const lotto_type_id = req.query.lotto_type_id;
//     const date = req.query.date;
//     // last query
//     //SELECT * FROM Table ORDER BY ID DESC LIMIT 1
//     if (lotto_type_id != undefined && date != undefined) {
//       var sql = `SELECT lt.active, IFNULL((p.prize6digit), 'xxxxxx') as prize6digit, p.prize3bottom, p.prize3top, p.prize2bottom, lt.lotto_type_name, lt.lotto_type_id, lt.lotto_type_img, lt.lotto_type_img, p.prize_time FROM prize as p LEFT JOIN lotto_type as lt ON p.lotto_type_id = lt.lotto_type_id WHERE lt.type_id IN ("2") AND p.status = 1 ORDER BY p.prize_time DESC LIMIT 3`;
//       connection.query(sql, [], (error, resultThai, fields) => {
//         var sql = `SELECT lt.lotto_type_id, lt.type_id, lt.lotto_type_name, lt.lotto_type_img, lt.closing_time, lt.active, IFNULL(( SELECT p.prize6digit FROM prize as p WHERE p.prize_time = ? AND p.lotto_type_id = lt.lotto_type_id AND p.status = 1 ORDER BY p.prize_id DESC LIMIT 1), 'xxxxxx') AS prize6digit, IFNULL((SELECT p.prize3bottom FROM prize as p WHERE p.prize_time = ? AND p.lotto_type_id = lt.lotto_type_id AND p.status = 1 ORDER BY p.prize_id DESC LIMIT 1), NULL) AS prize3bottom, IFNULL(( SELECT p.prize3top FROM prize as p WHERE p.prize_time = ? AND p.lotto_type_id = lt.lotto_type_id AND p.status = 1 ORDER BY p.prize_id DESC LIMIT 1), 'xxx') AS prize3top, IFNULL(( SELECT p.prize2bottom FROM prize as p WHERE p.prize_time = ? AND p.lotto_type_id = lt.lotto_type_id AND p.status = 1 AND lt.lotto_type_id = ? ORDER BY p.prize_id DESC LIMIT 1), 'xx') AS prize2bottom FROM lotto_type AS lt ORDER BY closing_time ASC`;
//         connection.query(
//           sql,
//           [date, date, date, date, lotto_type_id],
//           (error, result, fields) => {
//             // if (error) return res.status(400);
//             // console.log(error, "result");
//             try {
//               if (result === undefined) {
//                 return res
//                   .status(400)
//                   .send({ status: false, data: result, thai: resultThai });
//               } else {
//                 return res
//                   .status(200)
//                   .send({ status: true, data: result, thai: resultThai });
//               }
//             } catch (error) {
//               console.log(error);
//             }
//           }
//         );
//       });
//     } else if (date != undefined) {
//       var sql = `SELECT lt.active, IFNULL((p.prize6digit), 'xxxxxx') as prize6digit, p.prize3bottom, p.prize3top, p.prize2bottom, lt.lotto_type_name, lt.lotto_type_id, lt.lotto_type_img, lt.lotto_type_img, p.prize_time FROM prize as p LEFT JOIN lotto_type as lt ON p.lotto_type_id = lt.lotto_type_id WHERE lt.type_id IN ("2") AND p.status = 1 ORDER BY p.prize_time DESC LIMIT 3`;
//       connection.query(sql, [], (error, resultThai, fields) => {
//         var sql = `SELECT 
//     lt.lotto_type_id, 
//     lt.type_id, 
//     lt.lotto_type_name, 
//     lt.lotto_type_img, 
//     lt.closing_time, 
//     lt.active, 
//     p.prize_time,
//     COALESCE(p.prize6digit, 'xxxxxx') AS prize6digit,
//     COALESCE(p.prize3bottom, NULL) AS prize3bottom,
//     COALESCE(
//         CASE WHEN p.prize_time <= CURDATE() THEN p.prize3top ELSE 'xxx' END, 'xxx'
//     ) AS prize3top,
//     COALESCE(p.prize2bottom, 'xx') AS prize2bottom
// FROM lotto_type AS lt  
// LEFT JOIN (
//     SELECT p1.* 
//     FROM prize p1  
//     INNER JOIN (
//         SELECT lotto_type_id, MAX(prize_time) AS latest_time  
//         FROM prize  
//         WHERE prize_time <= CURDATE()  
//         GROUP BY lotto_type_id  
//     ) p2 ON p1.lotto_type_id = p2.lotto_type_id AND p1.prize_time = p2.latest_time  
// ) AS p ON lt.lotto_type_id = p.lotto_type_id  
// ORDER BY lt.closing_time ASC;
// `;
//         connection.query(
//           sql,
//           [date, date, date, date],
//           (error, result, fields) => {
//             console.log(error);
//             try {
//               if (result === undefined) {
//                 return res
//                   .status(400)
//                   .send({ status: false, data: result, thai: resultThai });
//               } else {
//                 return res
//                   .status(200)
//                   .send({ status: true, data: result, thai: resultThai });
//               }
//             } catch (error) {
//               console.log(error);
//             }
//           }
//         );
//       });
//     } else {
//       return res
//         .status(400)
//         .send({ status: false, msg: "กรุณาส่ง lotto_type_id, date" });
//     }
//   } catch (e) {
//     console.log(e);
//   }

//   /////////////////////////////////////////////
//   // connection.query(sql, [date, lotto_type_id], (error, result, fields) => {
//   //
//   //   console.log(result);
//   //   try {
//   //     if (result === undefined) {
//   //       // var sql =
//   //       //   "SELECT lotto_type_name, lotto_type_img, closing_time FROM lotto_type WHERE lotto_type_id = ?";
//   //       // connection.query(sql, [lotto_type_id], (error, resultType, fields) => {
//   //       //
//   //       //   if (resultType) {
//   //       //     const result = resultType;
//   //       //     result = {
//   //       //       ...data,
//   //       //       type3top: "3 ตัวบน",
//   //       //       prize3top: "xxx",
//   //       //       type2bottom: "2 ตัวล่าง",
//   //       //       prize2bottom: "xx",
//   //       //     };

//   //       //   }
//   //       // });
//   //       return res.status(400).send({ status: false, data: result });
//   //     } else {
//   //       return res.status(200).send({ status: true, data: result });
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // });
//   ///////////////////////////////
//   //   } else {
//   //   return res
//   //     .status(400)
//   //     .send({ status: "error", msg: "กรุณาส่ง page, perPage" });
//   //   }
//   // } else {
//   //     res.status(403).send({ status: false, msg: "กรุณาเข้าสู่ระบบ" });
//   // }
//   // });
// });

router.get("/", async (req, res) => {
  const { lotto_type_id, date } = req.query;

  if (!date) {
    return res.status(400).send({
      status: false,
      msg: "กรุณาส่ง lotto_type_id และ date",
    });
  }

  try {
    // ดึงข้อมูลหวยรัฐบาล (type_id = 2)
    const [resultThai] = await connection.promise().query(`
      SELECT lt.active, 
             IFNULL(p.prize6digit, 'xxxxxx') AS prize6digit, 
             p.prize3bottom, p.prize3top, p.prize2bottom, 
             lt.lotto_type_name, lt.lotto_type_id, lt.lotto_type_img, 
             p.prize_time 
      FROM prize p 
      LEFT JOIN lotto_type lt ON p.lotto_type_id = lt.lotto_type_id 
      WHERE lt.type_id = 2 AND p.status = 1 
      ORDER BY p.prize_time DESC 
      LIMIT 3
    `);

    let query = `
      SELECT 
        lt.lotto_type_id, lt.type_id, lt.lotto_type_name, 
        lt.lotto_type_img, lt.closing_time, lt.active,
        COALESCE(p.prize6digit, 'xxxxxx') AS prize6digit,
        COALESCE(p.prize3bottom, NULL) AS prize3bottom,
        COALESCE(p.prize3top, 'xxx') AS prize3top,
        COALESCE(p.prize2bottom, 'xx') AS prize2bottom,
        p.prize_time
      FROM lotto_type lt
      LEFT JOIN prize p 
        ON p.lotto_type_id = lt.lotto_type_id 
       AND p.prize_time = ?
       AND p.status = 1
    `;
    const params = [date];

    if (lotto_type_id) {
      query += ` WHERE lt.lotto_type_id = ?`;
      params.push(lotto_type_id);
    }

    query += ` ORDER BY lt.closing_time ASC`;

    const [result] = await connection.promise().query(query, params);

    return res.status(200).send({
      status: true,
      data: result,
      thai: resultThai,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: false,
      msg: "เกิดข้อผิดพลาด",
    });
  }
});

// router.get("/lotto-results", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, data) => {
//     if (!err) {
//       const lotto_type_id = req.query.lotto_type_id;
//       const installment = req.query.installment;
//       // last query
//       //SELECT * FROM Table ORDER BY ID DESC LIMIT 1

//       if (lotto_type_id != undefined && installment != undefined) {
//         var sql = "SELECT * FROM lotto_type WHERE lotto_type_id = ?";
//         connection.query(
//           sql,
//           [lotto_type_id],
//           (error, resultTypeLotto, fields) => {
//             if (resultTypeLotto.length > 0) {
//               // var date = moment(resultTypeLotto[0].closing_time).format(
//               //   "YYYY-MM-DD"
//               // );
//               var sql =
//                 "SELECT * FROM prize WHERE lotto_type_id = ? AND prize_time LIKE '%' ? '%'";
//               connection.query(
//                 sql,
//                 [lotto_type_id, installment],
//                 (error, resultPrize, fields) => {
//                   // console.log(resultPrize);
//                   // return res.status(200).send({ status: true, msg: result });
//                   if (resultPrize == "") {
//                     return res
//                       .status(400)
//                       .send({ status: false, msg: "ไม่พบข้อมูลหวยนี้" });
//                   } else {
//                     if (resultPrize[0].status == 0) {
//                       var sql =
//                         "SELECT ln.*, mb.credit_balance FROM lotto_number as ln JOIN lotto_type as lt ON ln.lotto_type_id = lt.lotto_type_id JOIN member as mb ON ln.created_by = mb.id WHERE ln.lotto_type_id = ? AND ln.status_poy = 'SUC' AND ln.installment_date LIKE '%' ? '%'";
//                       // "SELECT ln.*, mb.credit_balance FROM lotto_number as ln JOIN lotto_type as lt ON ln.lotto_type_id = lt.lotto_type_id JOIN member as mb ON ln.created_by = mb.id WHERE ln.lotto_type_id = ? AND ln.status_poy = 'SUC' AND lt.closing_time LIKE '%' ? '%'";
//                       connection.query(
//                         sql,
//                         [lotto_type_id, installment],
//                         (error, result, fields) => {
//                           var sqlUpdate = `UPDATE lotto_number SET status = 'suc' WHERE lotto_number_id = ? AND status_poy = 'SUC' AND status = 'wait'`;
//                           result.forEach((item) => {
//                             if (
//                               item.type_option === "วิ่งบน" &&
//                               dateChange(item.installment_date) === installment
//                             ) {
//                               const number = resultPrize.find((n) =>
//                                 n.prize3top.toString().includes(item.number)
//                               );
//                               if (number != undefined) {
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 // connection.query(
//                                 //   `UPDATE prize SET status = 1 WHERE prize_id = ?`,
//                                 //   [resultPrize[0].prize_id],
//                                 //   (error, result, fields) => {
//                                 //
//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                               }
//                             } else if (
//                               item.type_option === "วิ่งล่าง" &&
//                               dateChange(item.installment_date) === installment
//                             ) {
//                               const number = resultPrize.find((n) =>
//                                 n.prize2bottom.toString().includes(item.number)
//                               );
//                               if (number != undefined) {
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 // connection.query(
//                                 //   `UPDATE prize SET status = 1 WHERE prize_id = ?`,
//                                 //   [resultPrize[0].prize_id],
//                                 //   (error, result, fields) => {
//                                 //
//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                               }
//                             } else if (
//                               item.type_option === "2 ตัวบน" &&
//                               dateChange(item.installment_date) === installment
//                             ) {
//                               const number = resultPrize.find((n) =>
//                                 n.prize3top
//                                   .toString()
//                                   .substr(1)
//                                   .includes(item.number)
//                               );
//                               if (number != undefined) {
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 // connection.query(
//                                 //   `UPDATE prize SET status = 1 WHERE prize_id = ?`,
//                                 //   [resultPrize[0].prize_id],
//                                 //   (error, result, fields) => {
//                                 //
//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                               }
//                             } else if (
//                               item.type_option === "3 ตัวโต๊ด" &&
//                               dateChange(item.installment_date) === installment
//                             ) {
//                               const result = func3back(
//                                 resultPrize[0].prize3top
//                               );
//                               if (result.indexOf(item.number) != -1) {
//                                 // console.log(item.number, "ถูก 3 ตัวโต๊ด");
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 // connection.query(
//                                 //   `UPDATE prize SET status = 1 WHERE prize_id = ?`,
//                                 //   [resultPrize[0].prize_id],
//                                 //   (error, result, fields) => {
//                                 //
//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 // console.log(item.number, "ไม่ถูก 3 ตัว");
//                               }
//                             } else if (
//                               item.type_option === "3 ตัวบน" &&
//                               dateChange(item.installment_date) === installment
//                             ) {
//                               if (
//                                 parseInt(item.number) ===
//                                 parseInt(resultPrize[0].prize3top)
//                               ) {
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                               }
//                             } else if (
//                               item.type_option === "2 ตัวล่าง" &&
//                               dateChange(item.installment_date) === installment
//                             ) {
//                               if (item.number === resultPrize[0].prize2bottom) {
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                               }
//                               // console.log("ถูก 2 ตัว");
//                             } else if (
//                               item.type_option === "4 ตัวบน" &&
//                               dateChange(item.installment_date) ===
//                                 installment &&
//                               resultPrize[0].prize6digit != null
//                             ) {
//                               if (
//                                 item.number ===
//                                 resultPrize[0].prize6digit.slice(2)
//                               ) {
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                               }
//                             } else if (
//                               item.type_option === "4 ตัวโต๊ด" &&
//                               dateChange(item.installment_date) ===
//                                 installment &&
//                               resultPrize[0].prize6digit != null
//                             ) {
//                               const result = func4back(
//                                 resultPrize[0].prize6digit.slice(2)
//                               );
//                               console.log(result, "4back");
//                               if (
//                                 result.some((num) => num.includes(item.number))
//                               ) {
//                                 // console.log(item.number, "ถูก 3 ตัวโต๊ด");
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 // connection.query(
//                                 //   `UPDATE prize SET status = 1 WHERE prize_id = ?`,
//                                 //   [resultPrize[0].prize_id],
//                                 //   (error, result, fields) => {
//                                 //
//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 // console.log(item.number, "ไม่ถูก 3 ตัว");
//                               }
//                             } else if (
//                               item.type_option === "3 ตัวหน้า" &&
//                               dateChange(item.installment_date) === installment
//                               // && resultPrize[0].prize3bottom != null
//                             ) {
//                               const prize3front =
//                                 JSON.parse(resultPrize[0].prize3bottom).find(
//                                   (item) => item.prize3front
//                                 )?.prize3front || [];
//                               if (
//                                 item.number === prize3front[0] ||
//                                 item.number === prize3front[1]
//                               ) {
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                               }
//                             } else if (
//                               item.type_option === "3 ตัวหลัง" &&
//                               dateChange(item.installment_date) === installment
//                               // && resultPrize[0].prize3bottom != null
//                             ) {
//                               const prize3after =
//                                 JSON.parse(resultPrize[0].prize3bottom).find(
//                                   (item) => item.prize3after
//                                 )?.prize3after || [];
//                               console.log(prize3after, "prize3after");
//                               if (
//                                 item.number === prize3after[0] ||
//                                 item.number === prize3after[1]
//                               ) {
//                                 connection.query(
//                                   sqlUpdate,
//                                   [item.lotto_number_id],
//                                   (error, result, fields) => {}
//                                 );

//                                 var sql =
//                                   "INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES(?, ?, ?, ?, ?, ?)";
//                                 let total = 0;
//                                 total = item.price * item.pay;
//                                 connection.query(
//                                   sql,
//                                   [
//                                     item.lotto_type_id,
//                                     installment,
//                                     item.created_by,
//                                     total,
//                                     data.user.id,
//                                     item.poy_code,
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                                 //   }
//                                 // );
//                               } else {
//                                 connection.query(
//                                   `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                   [
//                                     item.lotto_type_id,
//                                     item.lotto_number_id,
//                                     "wait",
//                                   ],
//                                   (error, result, fields) => {}
//                                 );
//                               }
//                             } else {
//                               connection.query(
//                                 `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = ?`,
//                                 [
//                                   item.lotto_type_id,
//                                   item.lotto_number_id,
//                                   "wait",
//                                 ],
//                                 (error, result, fields) => {}
//                               );
//                             }
//                           });
//                           connection.query(
//                             `UPDATE poy SET status_result = ? WHERE lotto_type_id = ? AND installment_date = ?`,
//                             [1, lotto_type_id, installment],
//                             (error, result, fields) => {
//                               if (error) return console.log(error);
//                             }
//                           );
//                           connection.query(
//                             `UPDATE prize SET status = 1 WHERE prize_id = ?`,
//                             [resultPrize[0].prize_id],
//                             (error, result, fields) => {
//                               return res.status(200).send({
//                                 status: true,
//                                 msg: "อัพเดทออกผลหวยสำเร็จ",
//                               });
//                             }
//                           );
//                         }
//                       );
//                     } else {
//                       return res
//                         .status(400)
//                         .send({ status: true, msg: "หวยนี้ออกผลแล้ว" });
//                     }
//                   }
//                 }
//               );
//             } else {
//               return res
//                 .status(400)
//                 .send({ status: false, msg: "ไม่พบรหัสประเภทหวยนี้" });
//             }
//           }
//         );
//       } else {
//         return res
//           .status(400)
//           .send({ status: false, msg: "กรุณาส่งรหัสประเภทหวย" });
//       }
//     } else {
//       return res.status(403).send({ status: false, msg: "กรุณาเข้าสู่ระบบ" });
//     }
//   });
// });

const formatDate = (date) => moment(date).format("YYYY-MM-DD");

const rules = {
  วิ่งบน: (item, prize) => prize.prize3top?.toString().includes(item.number),
  วิ่งล่าง: (item, prize) =>
    prize.prize2bottom?.toString().includes(item.number),
  "2 ตัวบน": (item, prize) =>
    prize.prize3top?.toString().slice(-2) === item.number,
  "3 ตัวโต๊ด": (item, prize) =>
    func3back(prize.prize3top).includes(item.number),
  "3 ตัวบน": (item, prize) => item.number === prize.prize3top,
  "2 ตัวล่าง": (item, prize) => item.number === prize.prize2bottom,
  // "4 ตัวบน": (item, prize) => prize.prize6digit?.slice(2) === item.number,
  // "4 ตัวโต๊ด": (item, prize) => func4back(prize.prize6digit?.slice(2)).includes(item.number),
  // "3 ตัวหน้า": (item, prize) => {
  //   const front = JSON.parse(prize.prize3bottom || '[]').find(p => p.prize3front)?.prize3front || [];
  //   return front.includes(item.number);
  // },
  // "3 ตัวหลัง": (item, prize) => {
  //   const back = JSON.parse(prize.prize3bottom || '[]').find(p => p.prize3after)?.prize3after || [];
  //   return back.includes(item.number);
  // }
};

router.get("/lotto-results", verifyToken, async (req, res) => {
  try {
    const decoded = jwt.verify(req.token, "secretkey");
    const { lotto_type_id, installment } = req.query;

    if (!lotto_type_id || !installment) {
      return res
        .status(400)
        .json({ status: false, msg: "กรุณาส่งรหัสประเภทหวย" });
    }

    const [lottoType] = await connection
      .promise()
      .query("SELECT * FROM lotto_type WHERE lotto_type_id = ?", [
        lotto_type_id,
      ]);
    if (!lottoType.length)
      return res
        .status(400)
        .json({ status: false, msg: "ไม่พบรหัสประเภทหวยนี้" });

    const [prizes] = await connection
      .promise()
      .query(
        "SELECT * FROM prize WHERE lotto_type_id = ? AND prize_time LIKE ?",
        [lotto_type_id, `%${installment}%`]
      );
    if (!prizes.length)
      return res.status(400).json({ status: false, msg: "ไม่พบข้อมูลหวยนี้" });

    const prize = prizes[0];
    if (prize.status === 1)
      return res.status(400).json({ status: true, msg: "หวยนี้ออกผลแล้ว" });

    const [numbers] = await connection.promise().query(
      `SELECT ln.*, mb.credit_balance FROM lotto_number as ln 
       JOIN lotto_type as lt ON ln.lotto_type_id = lt.lotto_type_id 
       JOIN member as mb ON ln.created_by = mb.id 
       WHERE ln.lotto_type_id = ? AND ln.status_poy = 'SUC' AND ln.installment_date LIKE ?`,
      [lotto_type_id, `%${installment}%`]
    );

    for (const item of numbers) {
      const ruleCheck = rules[item.type_option];
      if (!ruleCheck || formatDate(item.installment_date) !== installment)
        continue;

      const win = ruleCheck(item, prize);
      if (win) {
        await connection
          .promise()
          .query(
            `UPDATE lotto_number SET status = 'suc' WHERE lotto_number_id = ? AND status_poy = 'SUC' AND status = 'wait'`,
            [item.lotto_number_id]
          );
        await connection
          .promise()
          .query(
            `INSERT INTO prize_log (lotto_type_id, lotto_date, created_by, total, submit_by, poy_code) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              item.lotto_type_id,
              installment,
              item.created_by,
              item.price * item.pay,
              decoded.user.id,
              item.poy_code,
            ]
          );
      } else {
        await connection
          .promise()
          .query(
            `UPDATE lotto_number SET status = 'fail' WHERE lotto_type_id = ? AND lotto_number_id = ? AND status = 'wait'`,
            [item.lotto_type_id, item.lotto_number_id]
          );
      }
    }

    await connection
      .promise()
      .query(
        `UPDATE poy SET status_result = 1 WHERE lotto_type_id = ? AND installment_date = ?`,
        [lotto_type_id, installment]
      );
    await connection
      .promise()
      .query(`UPDATE prize SET status = 1 WHERE prize_id = ?`, [
        prize.prize_id,
      ]);

    return res.status(200).json({ status: true, msg: "อัพเดทผลหวยสำเร็จ" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "เกิดข้อผิดพลาดภายในระบบ" });
  }
});

router.put("/return-results", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, data) => {
    if (!err) {
      const prizeId = req.body.prizeId;
      // const lotto_type_id = req.query.lotto_type_id;
      // last query
      //SELECT * FROM Table ORDER BY ID DESC LIMIT 1

      if (prizeId != "") {
        connection.query(
          `SELECT * FROM prize WHERE prize_id = ?`,
          [prizeId],
          (error, result, fields) => {
            if (result != "") {
              var date = moment(result[0].prize_time).format("YYYY-MM-DD");
              connection.query(
                // `SELECT * FROM prize_log WHERE lotto_type_id = ? AND lotto_date = ?`,
                `SELECT SUM(total * pay) as total, created_by FROM lotto_number WHERE installment_date = ? AND lotto_type_id = ? AND status = 'suc' GROUP BY created_by`,
                [date, result[0].lotto_type_id],
                (error, resultPrize, fields) => {
                  if (error) throw error;
                  let total = 0;
                  console.log(resultPrize, "resultPrize");
                  if (resultPrize != "") {
                    resultPrize.forEach((item) => {
                      connection.query(
                        `SELECT credit_balance FROM member WHERE id = ?`,
                        [item.created_by],
                        (error, resultMember, fields) => {
                          if (resultMember != "") {
                            total = parseFloat(item.total);
                            let credit =
                              parseFloat(resultMember[0].credit_balance) -
                              parseFloat(total);
                            connection.query(
                              `UPDATE member SET credit_balance = ? WHERE id = ?`,
                              [credit, item.created_by],
                              (error, resultUpdate, fields) => {
                                connection.query(
                                  `DELETE FROM prize_log WHERE lotto_type_id = ? AND lotto_date = ?`,
                                  [result[0].lotto_type_id, date],
                                  (error, resultUpdate, fields) => {}
                                );
                              }
                            );
                            console.log(result[0],'result[0].installment_date')
                            connection.query(
                              `INSERT INTO credit_log (credit_previous,credit_after,created_by,lotto_type_id, note, installment, prize) VALUES (?,?,?,?,?,?,?)`,
                              [
                                resultMember[0].credit_balance,
                                credit,
                                item.created_by,
                                result[0].lotto_type_id,
                                `คืนผลรางวัล ${item.total} บาท`,
                                result[0].prize_time,
                                item.total,
                              ],
                              (error, result, fields) => {}
                            );
                          }
                        }
                      );
                      // if (item.created_by) {

                      // }
                    });
                  }
                }
              );
              connection.query(
                `UPDATE lotto_number SET status = 'wait' WHERE status = 'fail' OR status = 'suc' AND lotto_type_id = ? AND installment_date = ?`,
                [result[0].lotto_type_id, date],
                (error, resultUpdate, fields) => {}
              );
              connection.query(
                `UPDATE poy SET status_result = ? WHERE lotto_type_id = ? AND installment_date = ?`,
                [0, result[0].lotto_type_id, date],
                (error, resultUpdate, fields) => {
                  if (error) throw error;
                }
              );
              connection.query(
                `UPDATE prize SET status = ? WHERE lotto_type_id = ? AND prize_time = ?`,
                [0, result[0].lotto_type_id, date],
                (error, resultUpdate, fields) => {}
              );
              return res
                .status(200)
                .send({ status: false, msg: "คืนผลรางวัลสำเร็จ" });
            } else {
              return res
                .status(400)
                .send({ status: false, msg: "ไม่พบรายการผลรางวัลนี้" });
            }
          }
        );
      } else {
        return res
          .status(400)
          .send({ status: false, msg: "กรุณาส่งรหัสประเภทหวย" });
      }
    } else {
      return res.status(403).send({ status: false, msg: "กรุณาเข้าสู่ระบบ" });
    }
  });
});

router.delete("/delete-award", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, data) => {
    if (!err) {
      const prizeId = req.body.prizeId;
      // const number = req.body.number;
      const type = req.body.type;
      var sql = "";
      if (prizeId != null) {
        connection.query(
          `SELECT * FROM prize WHERE prize_id = ?`,
          [prizeId],
          (error, result, fields) => {
            if (result != "") {
              var date = moment(result[0].prize_time).format("YYYY-MM-DD");
              connection.query(
                `SELECT SUM(total * pay) as total, created_by FROM lotto_number WHERE installment_date = ? AND lotto_type_id = ? AND status = 'suc' GROUP BY created_by`,
                [date, result[0].lotto_type_id],
                (error, resultPrize, fields) => {
                  let total = 0;
                  if (resultPrize != "") {
                    resultPrize.forEach((item) => {
                      connection.query(
                        `SELECT credit_balance FROM member WHERE id = ?`,
                        [item.created_by],
                        (error, resultMember, fields) => {
                          if (resultMember != "") {
                            total = parseFloat(item.total);
                            let credit =
                              parseFloat(resultMember[0].credit_balance) -
                              parseFloat(total);
                            connection.query(
                              `UPDATE member SET credit_balance = ? WHERE id = ?`,
                              [credit, item.created_by],
                              (error, resultUpdate, fields) => {
                                connection.query(
                                  `DELETE FROM prize_log WHERE lotto_type_id = ? AND lotto_date = ?`,
                                  [result[0].lotto_type_id, date],
                                  (error, resultUpdate, fields) => {}
                                );
                              }
                            );
                          }
                        }
                      );
                      // if (item.created_by) {

                      // }
                    });
                  }
                }
              );
              connection.query(
                `UPDATE lotto_number SET status = 'wait' WHERE status = 'fail' OR status = 'suc' AND lotto_type_id = ? AND installment_date = ?`,
                [result[0].lotto_type_id, date],
                (error, resultUpdate, fields) => {}
              );
              connection.query(
                `UPDATE poy SET status_result = ? WHERE lotto_type_id = ? AND installment_date = ?`,
                [0, result[0].lotto_type_id, date],
                (error, resultUpdate, fields) => {}
              );
              connection.query(
                `UPDATE prize SET status = ? WHERE lotto_type_id = ? AND prize_time = ?`,
                [0, result[0].lotto_type_id, date],
                (error, resultUpdate, fields) => {}
              );
              sql = "DELETE FROM prize WHERE prize_id = ?";
              connection.query(
                sql,
                [prizeId, type],
                (error, result, fields) => {
                  return res
                    .status(200)
                    .send({ status: true, msg: "ลบผลรางวัลสำเร็จ" });
                }
              );
              // return res
              //   .status(200)
              //   .send({ status: false, msg: "คืนผลรางวัลสำเร็จ" });
            } else {
              return res
                .status(400)
                .send({ status: false, msg: "ไม่พบรายการผลรางวัลนี้" });
            }
          }
        );
      } else {
        return res.status(400).send({ status: false, msg: "กรุณาส่ง prizeId" });
      }
    } else {
      res.status(403).send({ status: false, msg: "กรุณาเข้าสู่ระบบ" });
    }
  });
});

// router.put("/update-creditbalacne", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, data) => {
//     const lotto_type_id = req.body.lotto_type_id;
//     const installment = req.body.installment;
//     if (!err) {
//       if (lotto_type_id != "" && installment != "") {
//         var sql = "SELECT * FROM lotto_type WHERE lotto_type_id = ?";
//         connection.query(
//           sql,
//           [lotto_type_id],
//           (error, resultTypeLotto, fields) => {
//             if (resultTypeLotto.length > 0) {
//               // var date = moment(resultTypeLotto[0].closing_time).format(
//               //   "YYYY-MM-DD"
//               // );
//               var sql = `SELECT SUM(total * pay) as total, created_by FROM lotto_number WHERE installment_date = ? AND lotto_type_id = ? AND status = 'suc' GROUP BY created_by`;
//               connection.query(
//                 sql,
//                 [installment, lotto_type_id],
//                 (error, result, fields) => {
//                   let totalCredit = 0;
//                   result.forEach((item) => {
//                     connection.query(
//                       `SELECT credit_balance FROM member WHERE id = ?`,
//                       [item.created_by],
//                       (error, resultCredit, fields) => {
//                         if (resultCredit != "") {
//                           totalCredit =
//                             parseFloat(resultCredit[0].credit_balance) +
//                             parseFloat(item.total);
//                           connection.query(
//                             `UPDATE member SET credit_balance = ? WHERE id = ?`,
//                             [totalCredit, item.created_by],
//                             (error, result, fields) => {}
//                           );
//                           connection.query(
//                             `INSERT INTO credit_log (credit_previous,credit_after,created_by,lotto_type_id, note, installment, prize) VALUES (?,?,?,?,?,?,?)`,
//                             [
//                               resultCredit[0].credit_balance,
//                               totalCredit,
//                               item.created_by,
//                               lotto_type_id,
//                               `ถูกรางวัล ${item.total} บาท`,
//                               installment,
//                               item.total,
//                             ],
//                             (error, result, fields) => {}
//                           );
//                         }
//                       }
//                     );
//                   });
//                   return res
//                     .status(200)
//                     .send({ status: false, msg: "อัพเดทเครดิตสำเร็จ" });
//                 }
//               );
//             }
//           }
//         );
//       } else {
//         return res
//           .status(400)
//           .send({ status: false, msg: "กรุณาส่ง lotto_type_id" });
//       }
//     } else {
//       res.status(403).send({ status: false, msg: "กรุณาเข้าสู่ระบบ" });
//     }
//   });
// });
router.put("/update-creditbalacne", verifyToken, async (req, res) => {
  try {
    const decoded = jwt.verify(req.token, "secretkey");
    const { lotto_type_id, installment } = req.body;

    if (!lotto_type_id || !installment) {
      return res.status(400).json({ status: false, msg: "กรุณาส่งข้อมูลให้ครบ" });
    }

    const [lottoTypeRows] = await connection
      .promise()
      .query("SELECT * FROM lotto_type WHERE lotto_type_id = ?", [lotto_type_id]);

    if (lottoTypeRows.length === 0) {
      return res.status(400).json({ status: false, msg: "ไม่พบประเภทหวยที่ต้องการอัปเดต" });
    }

    const [winners] = await connection
      .promise()
      .query(
        `SELECT SUM(total * pay) as total, created_by 
         FROM lotto_number 
         WHERE installment_date = ? AND lotto_type_id = ? AND status = 'suc' 
         GROUP BY created_by`,
        [installment, lotto_type_id]
      );

    for (const winner of winners) {
      const [[member]] = await connection
        .promise()
        .query("SELECT credit_balance FROM member WHERE id = ?", [winner.created_by]);

      const creditBefore = parseFloat(member.credit_balance || 0);
      const prizeAmount = parseFloat(winner.total || 0);
      const creditAfter = creditBefore + prizeAmount;

      await connection
        .promise()
        .query("UPDATE member SET credit_balance = ? WHERE id = ?", [
          creditAfter,
          winner.created_by,
        ]);

      await connection
        .promise()
        .query(
          `INSERT INTO credit_log (credit_previous, credit_after, created_by, lotto_type_id, note, installment, prize)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            creditBefore,
            creditAfter,
            winner.created_by,
            lotto_type_id,
            `ถูกรางวัล ${prizeAmount} บาท`,
            installment,
            prizeAmount,
          ]
        );
    }

    return res.status(200).json({ status: true, msg: "อัปเดตเครดิตสำเร็จแล้ว" });
  } catch (err) {
    console.error("update-creditbalance error:", err);
    return res.status(500).json({ status: false, msg: "เกิดข้อผิดพลาด" });
  }
});


router.post("/add-type", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, data) => {
    if (!err) {
      const type = req.body.type;
      if (type) {
        var sql = "INSERT INTO type (type) VALUES(?)";
        connection.query(sql, [type], (error, result, fields) => {
          return res
            .status(200)
            .send({ status: true, msg: "เพิ่มประเภทหวยสำเร็จ" });
        });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: "กรุณาส่ง ชื่อประเภทหวย" });
      }
    } else {
      res.status(403).send({ status: false, msg: "กรุณาเข้าสู่ระบบ" });
    }
  });
});
module.exports = router;
