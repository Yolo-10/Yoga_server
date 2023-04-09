const express = require('express');
const router = express.Router();
const { callP, conn } = require("../utils/db");
const { generateToken } = require('../utils/token');
const { clone } = require('../utils/util')

router.get('/login', (req, res) => {
  let { u_id, password } = req.query;
  let sql = `select * from users where u_id="${u_id}" and password="${password}"`;

  conn.query(sql, (err, ret) => {
    if (err) res.status(500).json({ message: '登录失败', err })
    if (ret.length > 0) {
      let { u_name, u_type } = clone(ret[0]);
      let token = generateToken(u_id, u_name, u_type);
      res.status(200).json({ data: token, message: '登录成功' })
    } else
      res.status(666).json({ message: '用户名或密码错误' })
  })
})

router.post('/register', (req, res) => {
  let { u_id, u_name, password } = req.body;
  let sql1 = `select * from users where u_id="${u_id}"`;
  let sql2 = `insert into users values ("${u_id}","${u_name}","${password}",1)`;

  conn.query(sql1, (err,ret) => {
    if (err) res.status(500).json({ message: '注册失败', err })
    if (ret.length > 0) res.status(666).json({ message: '该账号已存在' })
    else{
      conn.query(sql2, (e,r) => {
        if (e) res.status(500).json({ message: '注册失败', err })
        if (r.affectedRows > 0) res.status(200).json({ message: '注册成功' })
      })
    }
  })
})

router.post('/addClass', (req, res) => {
  let {c_name, time, place, p_limit} = req.body;
  let sql = `insert into classes(c_name, time, place, p_limit) values ("${c_name}", "${time}", "${place}", ${p_limit})`;
  callP(sql, res);
})

router.get('/getMonClass', (req, res) => {
  let { Mon } = req.query;
  let sql = `select c.*,t.num from classes as c left join 
    ((select c_id,count(id) as num from signup group by c_id) as t) 
    on t.c_id=c.c_id 
    where year(time) ="${Mon.substring(0, 4)}" 
    and month(time) ="${Mon.substring(5, 7)}"`
  callP(sql,res);
})

router.get('/getDayClass', (req, res) => {
  let { Today } = req.query;
  let sql = `select * from classes where date_format(time,'%Y-%m-%d') = "${Today}"`;
  callP(sql,res);
})

router.post('/addDefault', (req,res)=>{
  let { u_id, u_name, c_id, time } = req.body;
  let sql = `insert into def (u_id, u_name, c_id, time) 
  values ("${u_id}", "${u_name}", "${c_id}", "${time}")`;
  callP(sql,res);
})

router.post('/delDef', (req,res)=>{
  let { c_id, u_id } = req.body;
  let sql = `delete from def where c_id=${c_id} and u_id="${u_id}"`;
  callP(sql,res);
})

router.get('/getMonSignupNum', (req, res) => {
  let {Mon} = req.query;
  let sql = `select count(id) as cnt,DATE_FORMAT(appo_time, '%Y-%m-%d') as day from signup 
  where DATE_FORMAT(appo_time, '%Y-%m') = "${Mon}"
  group by day(appo_time);`;
  callP(sql, res);
})

router.post('/signupClass', (req, res) => {
  let { c_id, c_name, u_id, u_name, appo_time } = req.body;
  let sql = `insert into signup (c_id, c_name, u_id, u_name,appo_time) 
  values ("${c_id}", "${c_name}", "${u_id}", "${u_name}","${appo_time}")`;
  callP(sql, res);
})

router.post('/delSignupClass', (req, res) => {
  let { c_id, u_id } = req.body;
  let sql = `delete from signup where c_id=${c_id} and u_id="${u_id}"`;
  callP(sql, res);
})

router.get('/getSignupUsers', (req, res) => {
  let { c_id } = req.query;
  let sql=`select a.*,b.times from (
    select s.id,s.c_id,s.c_name,s.u_id,s.u_name,s.appo_time,time 
    from signup as s left join def on s.u_id=def.u_id and s.c_id=def.c_id
    where s.c_id=${c_id}) as a left join 
    (select u_id,count(time) times from def group by u_id) as b on a.u_id=b.u_id;`;
  callP(sql, res);
})

router.get('/getClassById', (req, res) => {
  let { c_id } = req.query;
  let sql = `select * from classes where c_id =${c_id}`;
  callP(sql, res);
})

router.get('/getBlackTime', (req, res) => {
  let { u_id } = req.query;
  let sql = `select * from def where u_id ="${u_id}"`;
  callP(sql, res)
})

module.exports = router;