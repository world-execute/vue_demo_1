const express =require('express')
const UserRouter = express.Router()
const userHandler = require('../router_handlers/userHandler')
const joi = require('../validation/userValidation')
const expressJoi = require('@escook/express-joi')

// 登录验证接口
// POST /api/private/users/login
// public
UserRouter.post('/users/login',expressJoi(joi.joiSchema_forLogin),userHandler.login)

// 用户数据列表
// GET /api/private/users
UserRouter.get('/users',)

// 添加用户
// POST /api/private/users
UserRouter.post('/users',userHandler.addUsers)

// 根据 ID 查询用户信息
// GET /api/private/users/:id
UserRouter.get('users/:id')

// 编辑用户信息
// PUT /api/private/users/:id
UserRouter.put('users/:id')

// 删除单个用户
// DELETE /api/private/users/:id
UserRouter.delete('users/:id')

module.exports = UserRouter
