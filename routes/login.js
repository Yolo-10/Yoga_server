const express = require('express');
const router = express.Router();
const connection = require("../utils/db");
const {generateToken} = require('../utils/token');

router.get('/',(request,response)=>{
  let {u_id,password} = request.query;
  let sql = `select password from users where u_id=${u_id}`;

  connection.query(sql,function(err,res){
    if(err) response.json({status:-1,message:"登录失败",err});
    if(res.length == 0) response.json({status:-1,message:"用户名或密码错误"})
    else{
      let realPwd =res[0].password;
      if(realPwd !== password){
        response.json({status:-1,message:"用户名或密码错误"})
      }else{
        let token = generateToken(u_id);
        response.json({status:0,message:"登录成功",data:token})
      }
    }
  })
})

module.exports = router;