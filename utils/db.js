const mysql = require("mysql")
const { dbName, user, pwd, host, port } = require('../constant').database;

// 创建连接池
let pool = mysql.createPool({
  host: host,
  port: port,
  user: user,
  password: pwd,
  database: dbName,
  useConnectionPooling: true,
  connectionLimit: 20, //最大连接数
  charset: "utf8", //数据库服务器的编码方式
})

module.exports = pool;
