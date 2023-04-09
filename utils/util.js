const clone =(e)=> {
    return JSON.parse(JSON.stringify(e))
}

const auth = async(req,res,next) => {
    let decode;
    let token = req.headers.authorization;
  
    if (!token)
        res.status(401).json({ data: null, message: '无令牌，请登录' })
    try {
        decode = verifyToken(token).user.id;
    } catch (err) {
      if (err.name === 'TokenExpiredError') 
        res.status(401).json({ data: null, message: '令牌过期，请重新登录' })
      else if (err.name === 'JsonWebTokenError')
        res.status(401).json({ data: null, message: '无效令牌，请重新登录' })
    }
    await next()
}

module.exports = {
    auth,
    clone,
}
  