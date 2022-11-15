const express = require('express')
const cors = require("cors")
const app = express()
const {secret,algorithms,path} = require('./config/Token')
const Jwt = require('express-jwt')
const port = 5000
const {mongoose} = require('mongoose')
const {url} = require('./config/db')
const joi = require('joi')

// 导入路由
const userRouter = require('./router/User')

// 跨域与请求数据解析
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// 连接mongodb数据库
mongoose.connect(url).then(()=>{
    console.log('MongoDB数据库已连接')
}).catch((err)=>{
    console.log('连接失败,'+err.message)
})

testToken = (Jwt.expressjwt({secret,algorithms}).unless({path}))

// 注册路由
app.use('/api/private',testToken,userRouter)

// 全局错误中间件
app.use((err,req, res, next) => {
    if(err){
        if(err.message === 'No authorization token was found'){
            return res.status(401).json({msg:'无效的Token或Token已过期'})
        }
        if(err instanceof joi.ValidationError){
            return res.status(403).json({msg:err.message})
        }
        return res.status(500).json({msg:'服务器未知错误',err:err})
    }
})
app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
})
