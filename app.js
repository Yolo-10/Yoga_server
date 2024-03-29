//引入框架
const express = require("express");
const bodyParser = require('body-parser'); //post请求参数解析需要
const cors = require('cors');
const path = require('path');
// const { expressjwt } = require("express-jwt");
var compression = require('compression')
// const { secretKey } = require('./constant/index').security;
const router = require('./routes/index')

const app = express();

//gzip打包
app.use(compression());
app.use(cors());  //允许跨域
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//静态资源
app.use(express.static(path.join(__dirname,'/public')));
app.get('/',(req,res)=>{
  res.render('/public/index.html');
})

//jwt鉴权
// app.use(expressjwt({ 
//   secret:secretKey, algorithms: ["HS256"] 
// }).unless({path: [
//     "/",
//     "/login",
//     "/login/",
//     "/register",
//     "/register/",
//     "/api/getMonClass",
//     "/api/getDayClass",
// ] })) 

app.use('/api/',router);

//错误处理
app.use(function(err){
  if(err) throw err;
})

app.listen(8000,()=>{
  console.log('8000服务器已开启');
})