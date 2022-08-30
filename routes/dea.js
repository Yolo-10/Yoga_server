const express = require('express');
const router = express.Router();
const connection = require("../utils/db");

const dbOption = async(sql,response)=>{
  connection.query(sql,await function(err,res){
    return err? response.json({status:-1,message:"请求失败",err})
    :response.json({status:1,message:"请求成功",data:res});
  })
}

router.post('/addDefault',async(request,response)=>{
  let {u_id,u_name,c_id,time} = request.body;
  let sql = `insert into def (u_id, u_name, c_id, time) values ("${u_id}", "${u_name}", "${c_id}", "${time}")`;
  return await dbOption(sql,response);
})

router.post('/signupClass',async(request,response)=>{
  let {c_id, c_name, u_id, u_name,appo_time} = request.body;
  let sql = `insert into signup (c_id, c_name, u_id, u_name,appo_time) values ("${c_id}", "${c_name}", "${u_id}", "${u_name}","${appo_time}")`;
  return await dbOption(sql,response);
})

router.post('/delSignupClass',async(request,response)=>{
  let {c_id, u_id} = request.body;
  let sql = `delete from signup where c_id=${c_id} and u_id=${u_id}`;
  return await dbOption(sql,response);
})

router.post('/delDef',async(request,response)=>{
  let {c_id, u_id} = request.body;
  let sql = `delete from def where c_id=${c_id} and u_id=${u_id}`;
  return await dbOption(sql,response);
})

router.get('/getSignupUsers',async(request,response)=>{
  let {c_id} = request.query;
  let sql=`select a.*,b.times
  from (
    select s.id,s.c_id,s.c_name,s.u_id,s.u_name,s.appo_time,time 
    from signup as s 
    left join def 
    on s.u_id=def.u_id and s.c_id=def.c_id 
    where s.c_id=${c_id}
  ) as a 
  left join 
    (select u_id,count(time) times from def group by u_id)
    as b 
  on a.u_id=b.u_id;`;
  return await dbOption(sql,response);
})

router.get('/getClassById',async(request,response)=>{
  let {c_id} = request.query;
  
  let sql = `select * from classes where c_id =${c_id}`;
  return await dbOption(sql,response);
})

router.get('/getBlackTime',async(request,response)=>{
  let {u_id} = request.query;
  let sql = `select * from def where u_id =${u_id}`;
  connection.query(sql,await function(err,res){
    return err? response.json({status:-1,message:"请求失败",err})
    :response.json({status:1,message:"请求成功",data:res.length});
  })
})

module.exports = router;