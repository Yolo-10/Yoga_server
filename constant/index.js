module.exports = {
  database: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    pwd: '123456',
    dbName: 'yoga_db',
  },
  security: {
    secretKey: 'yoga_server', // 秘钥
    expiresIn: 60 * 24 * 7, // 令牌过期时间 60秒*24*7
    // expiresIn:60,
  }
};
