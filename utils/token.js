const jwt = require('jsonwebtoken');
const { secretKey,expiresIn } = require('../constant').security;

//生成token
const generateToken = ({username})=>{
  let token = jwt.sign(
    {username},
    secretKey,
    {expiresIn}
  )
  return token;
}

// token鉴权
const verifyToken = (req,res,next) =>{
  if(req.headers.authorization){
    let token = req.headers.authorization.split(' ')[1];
    try{
      jwt.verify(token,secretKey);
      next();
    }catch(err){
      res.status(401).send("登录信息失效，请重新登录");
      return;
    }
  }else{
    res.status(401).send("登录信息失效，请重新登录");
  }
}

module.exports = {
  generateToken,
  verifyToken,
}
