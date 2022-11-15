const express = require('express')
const cors = require("cors")
const app = express()
const {secret,algorithms,path} = require('./config/Token')
const Jwt = require('express-jwt')
const port = 5000
const userRouter = require('./router/User')

app.use(cors())
app.use(express.json)
app.use(express.urlencoded({extended:false}))

// app.use(Jwt.expressjwt({secret,algorithms}).unless({path}))
app.get('/api',(req, res) => {
    res.send('ok')
})
app.use('/api/private/users',userRouter)

app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
})
