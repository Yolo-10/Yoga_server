//引入框架
const express = require("express");
const bodyParser = require('body-parser'); //post请求参数解析需要
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const { expressjwt } = require("express-jwt");
var compression = require('compression')
const { secretKey } = require('./constant/index').security;

const app = express();
const login = require('./routes/login')
const init = require('./routes/init')
const dea = require('./routes/dea')

// app.use(expressjwt({ 
//   secret:secretKey, algorithms: ["HS256"] 
// }).unless({path: [
//     "/",
//     "/login",
//     "/login/",
//     "/umi.js",
//     "/umi.css",
//     "/static",
//     "/static/sprite_normal.ef7a085b.svg",
//     "/static/yoga.34127fd5.svg",
//     "/favicon.ico",
//   "/api/login",
//   "/api/init/getMonClass",
//   "/api/init/getDayClass",
//   "api/init/getMonSignupNum",
// ] })) 

//gzip打包
app.use(compression());
app.use(cors());  //允许跨域
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api/login',login);
app.use('/api/init',init);
app.use('/api/dea',dea);

app.use(express.static(path.join(__dirname,'/public')));

// app.use((err, req, res, next)=> {
//   if(err.name == "UnauthorizedError"){
//     res.status(401).send("登录信息失效，请重新登录");
//   }else {
//     next(err);
//   }
// });

app.get('/',(request,response)=>{
  response.render('/public/index.html');
})


app.listen(8000,()=>{
  console.log('8000服务器已开启');
})