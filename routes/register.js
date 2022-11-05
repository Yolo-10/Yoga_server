const express = require('express');
const router = express.Router();
const connection = require("../utils/db");

router.post('/',(request,response)=>{
  let {u_id,u_name,password} = request.body;
  let sql1 = `select * from users where u_id="${u_id}"`;
  let sql2 = `insert into users values ("${u_id}","${u_name}","${password}",1)`;

  connection.query(sql1,function(err,res){
    if(err) response.json({status:-1,message:"注册失败",err});
    if(res.length > 0) response.json({status:-1,message:"该账号已存在"})
    else{
      connection.query(sql2,function(error,result){
        if(error) response.json({status:-1,message:"注册失败",error});
        if(result.affectedRows >0) response.json({status:0,message:"注册成功"});
      })
    }
  })

})

module.exports = router;