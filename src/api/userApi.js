import {get,post} from '@/util/request'
// 用户登录
export const userLogin = params => post('login',params)
