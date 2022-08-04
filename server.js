//引入框架
const moment = require("moment");
const express = require("express");
const mysql = require("mysql"); 
const bodyParser = require('body-parser'); //post请求参数解析需要
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');


const app = express();
app.use(cors());  //允许跨域
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//连接数据库
const config = require("./config.json");
const { request, response } = require("express");
var connection = mysql.createConnection(config);
connection.connect(err =>{
  if(err) console.log('连接失败');
  else console.log('连接成功')
});

//生成token
const signToken = ({username,password})=>{
  let token = jwt.sign(
    {username,password},
    "yoga_server",
    {expiresIn:'1h'}
  )
  return token;
}

//鉴权
const verifyToken = (req,res,next) =>{
    let token = req.headers.yoga_token;
    try{
      jwt.verify(token,"yoga_server");
      next();
    }catch(err){
      res.json({status:0,message:"token无效或登录已过期",err})
      return;
    }
    next();
}

const dbOption = (sql,response)=>{
  connection.query(sql,function(err,res){
    return err? response.json({status:-1,message:"请求失败",err})
    :response.json({status:1,message:"请求成功",data:res});
  })
}

app.use(express.static(path.join(__dirname,'/public')));

app.get('/',(request,response)=>{
  response.render('/public/index.html');
})

app.get('/userlogin',(request,response)=>{
  let {u_id,password} = request.query;
  let sql = `select password from users where u_id=${u_id}`;

  connection.query(sql,function(err,res){
    if(err) response.json({status:-1,message:"登录失败",err});
    else{
      let realPwd =res[0].password;
      if(realPwd !== password){
        response.json({status:-2,message:"密码错误",err:"密码错误"})
      }else{
        let token = signToken(u_id,realPwd);
        response.json({status:0,message:"请求成功",data:token})
      }
    }
  })
})

app.post('/addClass',(request,response)=>{
  let {c_name, time, place, p_limit,nm_money} = request.body;
  let sql = `insert into classes(c_name, time, place, p_limit,nm_money) values ("${c_name}", "${time}", "${place}", ${p_limit},"${nm_money}")`;
  return dbOption(sql,response);
})

app.post('/addDefault',(request,response)=>{
  let {u_id,u_name,c_id,time} = request.body;
  let sql = `insert into def (u_id, u_name, c_id, time) values ("${u_id}", "${u_name}", "${c_id}", "${time}")`;
  return dbOption(sql,response);
})

app.get('/getMonClass',(request,response)=>{
  let {Mon} = request.query;
  let sql = `select * from classes where year(time) ="${Mon.substring(0,4)}" and month(time) ="${Mon.substring(6,7)}"`;
  return dbOption(sql,response);
})

app.get('/getTodayClass',(request,response)=>{
  let {Today} = request.query;
  let sql = `select * from classes where date_format(time,'%Y-%m-%d') = "${Today}"`;
  return dbOption(sql,response);
})

app.get('/getSignupUsers',(request,response)=>{
  let {c_id} = request.query;

  let sql=`select s.id,s.c_id,s.c_name,s.u_id,s.u_name,s.appo_time,time
  from signup as s left join def on s.u_id=def.u_id where s.c_id=${c_id}`;
  return dbOption(sql,response);
})

app.get('/getClassById',(request,response)=>{
  let {c_id} = request.query;
  
  let sql = `select * from classes where c_id =${c_id}`;
  return dbOption(sql,response);
})

app.listen(8000,()=>{
  console.log('8000服务器已开启');
})