const express =require('express')
const UserRouter = express.Router()
const userHandler = require('../router_handlers/user')

// 登录验证接口
// POST /api/private/users/login
// public
UserRouter.post('/users/login',userHandler.login)

// 用户数据列表
// GET /api/private/users
UserRouter.get('/users',)

// 添加用户
// POST /api/private/users
UserRouter.post('/users')

// 修改用户状态
// POST /api/private/users/:id/state/:type
UserRouter.post('/users/:id/state/:type')

// 根据 ID 查询用户信息
// GET /api/private/users/:id
UserRouter.get('users/:id')

// 编辑用户提交
// PUT /api/private/users/:id
UserRouter.put('users/:id')

// 删除单个用户
// DELETE /api/private/users/:id
UserRouter.delete('users/:id')

// 分配用户角色
// PUT /api/private/users/:id/role
UserRouter.put('/users/:id/role')

module.exports = UserRouter
