const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();


//constants
const TABLE_NAME = process.env.TABLE_NAME;
const DB_NAME = process.env.DB_NAME;
const HOST=process.env.DB_HOST;
const USER=process.env.DB_USER;
const DB_PASSWORD=process.env.DB_PASSWORD;
const app = express();
let status=process.env.status;
let port=process.env.status==='production'?process.env.PRODUCTION_PORT:process.env.DEV_PORT||1000;


const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});
// checking connection with the database;

connection.connect((err) => {
  if (err) throw err;
  console.log("connection established successful");
});

// checking if table exists
const query = `show tables like "${TABLE_NAME}"`;
connection.query(query, (err, result) => {
  if (result.length == 1) {
    console.log("table exists");
  } else if (result.length == 0) {
    console.log("table does not exist");
    funQuery(
      `create table ${TABLE_NAME}(name VARCHAR(100),password VARCHAR(100))`
    );
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
// get method
app.get("/", (req, res) => {
  const names = [];
  connection.query(`select * from ${TABLE_NAME}`, (err, result) => {
    result.forEach((element) => {
      console.log(element.name);
      names.push(element.name);
    });
    res.send(names);
  });
});
// posting the data to database
app.post("/", (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  InsertDataDatabase(name, password);
});
//updating the database
app.patch("/", (req, res) => {
  let where = req.body.where;
  let name = req.body.name;
  let password = req.body.password;
  UpdateDataDatabase(name, password, where);
});
//deleting data from database
app.delete("/", (req, res) => {
  let where = req.body.where;
  console.log(where);
  DeleteDataDatabase(where);
});

app.listen(port, () => {
  console.log(`listening on ${status} ${port}`);
});
function funQuery(query) {
  connection.query(query, (err, result) => {
    if (err) throw err;
    else {
      console.log(result);
    }
  });
}
function InsertDataDatabase(name, password) {
  const query = `INSERT INTO ${TABLE_NAME}(name,password) VALUES('${name}','${password}')`;
  connection.query(query, (err, result, fields) => {
    if (err) throw err;
    else console.log(result);
  });
}
function UpdateDataDatabase(name, password, where) {
  const query = `UPDATE ${TABLE_NAME} SET name='${name}',password='${password}' where name='${where}'`;
  connection.query(query, (err, result, fields) => {
    if (err) throw err;
    else console.log(result);
  });
}
function DeleteDataDatabase(where) {
  const query = `DELETE FROM ${TABLE_NAME} WHERE name='${where}'`;
  connection.query(query, (err, result, fields) => {
    if (err) throw err;
    else console.log(result);
  });
}