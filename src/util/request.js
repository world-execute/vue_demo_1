import axios from "axios";
import { Loading } from 'element-ui';

// 封装请求方法
// 初始化axios对象实例
const instance = axios.create({
    // 接口地址根路径
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    // 请求超时时间
    timeout: 1000
});
let loading
// 请求加载动画
const startLoading = () => {
    loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
// 关闭请求动画
const endLoading = () => {
    loading.close()
}

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 加载请求动画
    startLoading()
    // 为请求头对象,添加 Token 验证的Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 关闭请求动画
    endLoading()
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 关闭请求动画
    endLoading()
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

// GTE请求方法
let get = (url,params) => {
    // console.log(params)
    return new Promise((resolve, reject) => {
        instance.get(url,{params}).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

// POST请求方法
let post = (url,params) => {
    return new Promise((resolve, reject) => {
        instance.post(url,params).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

// PUT请求方法
let put = (url,params) => {
    return new Promise((resolve, reject) => {
        instance.put(url,params).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

// DELETE请求方法
let _delete = (url,params) => {
    return new Promise((resolve, reject) => {
        instance.delete(url,params).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

// 导出get和post方法
export {
    get,
    post,
    put,
    _delete
}

