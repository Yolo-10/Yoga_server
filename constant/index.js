module.exports = {
  database: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    pwd: '123456',
    dbName: 'yoga',
  },
  security: {
    secretKey: 'yoga_server', // 秘钥
    expiresIn: 60 * 60, // 令牌过期时间 一小时
    // expiresIn:60,
  }
};
