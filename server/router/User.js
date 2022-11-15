const express =require('express')
const UserRouter = express.Router()

UserRouter.post('/login',(req, res) => {
    res.send('ok')
})
UserRouter.get('/',(req, res) => {
    res.send('ok')
})

module.exports = UserRouter
