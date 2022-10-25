const express = require('express');
const router = express.Router();
const connection = require("../utils/db");

const dbOption = (sql,response)=>{
  connection.query(sql,function(err,res){
    return err? response.json({status:-1,message:"请求失败",err})
    :response.json({status:1,message:"请求成功",data:res});
  })
}

router.get('/getMonClass',(request,response)=>{
  let {Mon} = request.query;
  let sql = ` select c.*,t.num from classes as c left join 
  ( (select c_id,count(id) as num from signup group by c_id)  as t ) on t.c_id=c.c_id 
  where year(time) ="${Mon.substring(0,4)}" and month(time) ="${Mon.substring(5,7)}"`
  return dbOption(sql,response);
})

router.get('/getDayClass',(request,response)=>{
  let {Today} = request.query;
  let sql = `select * from classes where date_format(time,'%Y-%m-%d') = "${Today}"`;
  return dbOption(sql,response);
})

router.get('/getMonSignupNum',(request,response)=>{
  let {Mon} = request.query;
  let sql = `select count(id) as cnt,DATE_FORMAT(appo_time, '%Y-%m-%d') as day from signup 
  where DATE_FORMAT(appo_time, '%Y-%m') = "${Mon}"
  group by day(appo_time);`;
  return dbOption(sql,response);
})

router.post('/addClass',(request,response)=>{
  let {c_name, time, place, p_limit} = request.body;
  let sql = `insert into classes(c_name, time, place, p_limit) values ("${c_name}", "${time}", "${place}", ${p_limit})`;
  return dbOption(sql,response);
})


module.exports = router;