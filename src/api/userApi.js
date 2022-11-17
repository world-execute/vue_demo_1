import {get,post} from '@/util/request'
export const userLogin = params => post('/login',params)
