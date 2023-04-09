const mysql = require("mysql")
const { dbName, user, pwd, host, port } = require('../constant').database;

// 创建连接池
const conn = mysql.createPool({
  host: host,
  port: port,
  user: user,
  password: pwd,
  database: dbName,
  useConnectionPooling: true,
  connectionLimit: 20, //最大连接数
  charset: "utf8", //数据库服务器的编码方式
})

const callP = async (sql, res) => {
  conn.query(sql, (err, ret) => {
    if (err)
      res.status(500).json({ message: "请求失败", err });
    else
      res.status(200).json({ message: "请求成功", data: ret });
  })
}

module.exports = { callP, conn };
