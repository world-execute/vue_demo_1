import {get,post,put} from '@/util/request'
// 用户登录
export const userLogin = params => post('login',params)
// 获取用户列表
export const get_userList = params => get('users',params)
// 改变用户状态
export const changeUserState = (id,type) => put(`users/${id}/state/${type}`)
// 添加用户信息
export const addUser = params => post('users',params)
// 根据id获取用户信息
export const get_userById = params => get(`users/${params}`)
// 修改用户信息
export const editUser = (id,params) => put(`users/${id}`,params)
