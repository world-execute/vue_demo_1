import {get,post,put,_delete} from '@/util/request'
// 用户登录
export const userLogin = params => post('login',params)
// 获取用户列表
export const get_userList = params => get('users',params)
// 改变用户状态
export const changeUserState = (id,type) => put(`users/${id}/state/${type}`)
// 添加用户信息
export const addUser = params => post('users',params)
// 根据id获取用户信息
export const get_userById = id => get(`users/${id}`)
// 修改指定id用户信息
export const editUser = (id,params) => put(`users/${id}`,params)
// 根据id删除用户信息
export const deleteUser = id => _delete(`users/${id}`)
