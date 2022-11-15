const express = require('express')
const cors = require("cors")
const app = express()
const {secret,algorithms,path} = require('./config/Token')
const Jwt = require('express-jwt')
const port = 5000
const userRouter = require('./router/User')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

testToken = (Jwt.expressjwt({secret,algorithms}).unless({path}))

app.use('/api/private',testToken,userRouter)

app.use((err,req, res, next) => {
    console.log(err)
    switch (err.status){
        case 401:res.send('Token无效或已过期');
        break
    }
})
app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
})
