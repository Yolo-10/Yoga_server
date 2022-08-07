const express = require('express');
const router = express.Router();
const connection = require("../utils/db");
const {verifyToken} = require('../utils/token');

const dbOption = (sql,response)=>{
  connection.query(sql,function(err,res){
    return err? response.json({status:-1,message:"请求失败",err})
    :response.json({status:1,message:"请求成功",data:res});
  })
}

router.get('/getMonClass',(request,response)=>{
  let {Mon} = request.query;
  let sql = `select * from classes where year(time) ="${Mon.substring(0,4)}" and month(time) ="${Mon.substring(6,7)}"`;
  return dbOption(sql,response);
})

router.get('/getTodayClass',(request,response)=>{
  let {Today} = request.query;
  let sql = `select * from classes where date_format(time,'%Y-%m-%d') = "${Today}"`;
  return dbOption(sql,response);
})

router.post('/addClass',verifyToken,(request,response)=>{
  let {c_name, time, place, p_limit,nm_money} = request.body;
  let sql = `insert into classes(c_name, time, place, p_limit,nm_money) values ("${c_name}", "${time}", "${place}", ${p_limit},"${nm_money}")`;
  return dbOption(sql,response);
})




module.exports = router;