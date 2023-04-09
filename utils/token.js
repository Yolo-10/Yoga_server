const jwt = require('jsonwebtoken');
const { secretKey,expiresIn } = require('../constant').security;

//生成token
const generateToken = (u_id,u_name,u_type)=>{
  let token = jwt.sign(
    {u_id,u_name,u_type},
    secretKey,
    {expiresIn}
  )
  return token;
}

// token鉴权
const verifyToken = function (token) {
  return jwt.verify(token,secretKey)
}

module.exports = {
  generateToken,
  verifyToken,
}
